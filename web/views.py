from django.shortcuts import (
    render,
    get_object_or_404,
    redirect
)

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import (
    Project,
    Blog,
    Quiz,
    Contact,
    QuizSubmission
)

from certificate.models import (
    Certificate
)

from certificate.services import (
    generate_certificate
)

from urllib.parse import (
    urlparse,
    parse_qs
)

import json
import re



# YouTube ID extractor
def get_youtube_id(url):

    if not url:
        return None

    parsed = urlparse(url)

    if "youtube.com" in parsed.netloc:

        return parse_qs(
            parsed.query
        ).get(
            "v",
            [None]
        )[0]

    elif "youtu.be" in parsed.netloc:

        return parsed.path.lstrip("/")

    return None

# সোলার প্যাকেজ পেজ রেন্ডার করার ভিউ
def solar_package(request):
    return render(request, 'solar_package.html')

# Home
def home(request):

    if request.method == "POST":

        Contact.objects.create(

            full_name=request.POST.get(
                "full_name"
            ),

            company=request.POST.get(
                "company"
            ),

            email=request.POST.get(
                "email"
            ),

            phone=request.POST.get(
                "phone"
            ),

            service=request.POST.get(
                "service"
            ),

            message=request.POST.get(
                "message"
            ),
        )

        return redirect('/')


    projects = Project.objects.all().order_by(
        '-created_at'
    )

    blogs = Blog.objects.all().order_by(
        '-created_at'
    )

    return render(
        request,
        'index.html',
        {
            'projects': projects,
            'blogs': blogs
        }
    )



# Blog Detail
def blog_detail(request, slug):

    blog = get_object_or_404(
        Blog,
        slug=slug
    )

    youtube_id = None

    if (
        blog.media_type == "video"
        and
        blog.youtube_link
    ):

        youtube_id = get_youtube_id(
            blog.youtube_link
        )

    return render(
        request,
        'blog_detail.html',
        {
            'blog': blog,
            'youtube_id': youtube_id
        }
    )



# Quiz Page
def quiz_page(request):

    quizzes = Quiz.objects.prefetch_related(
        'questions'
    )

    return render(
        request,
        'quiz.html',
        {
            'quizzes': quizzes
        }
    )



# Quiz Save API
@csrf_exempt
def save_quiz(request):

    if request.method == "POST":

        data = json.loads(
            request.body
        )


        QuizSubmission.objects.create(

            name=data["name"],
            email=data["email"],
            phone=data["phone"],
            quiz_name=data["quiz"],
            score=data["score"],
            total=data["total"],
            percentage=data["percentage"],
            answers=data["answers"]

        )


        percentage = int(
            data["percentage"]
        )


        if percentage >= 80:

            grade = "A"

        elif percentage >= 60:

            grade = "B"

        else:

            grade = "C"


        certificate = (
            Certificate.objects.create(

                participant_name=
                data["name"],

                quiz_name=
                data["quiz"],

                score=
                percentage,

                grade=
                grade
            )
        )


        generate_certificate(
            certificate
        )


        return JsonResponse({

            "success": True,

            "certificate_id":
            certificate.certificate_id,

            "download_url":
            f"/certificate/download/{certificate.certificate_id}/"

        })

    return JsonResponse({

        "success": False

    })