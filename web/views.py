from django.shortcuts import render, get_object_or_404
from .models import Project, Blog

from .models import Quiz

import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import QuizSubmission



def home(request):
    projects = Project.objects.all().order_by('-created_at')
    blogs = Blog.objects.all().order_by('-created_at')

    return render(request,'index.html',{
        'projects':projects,
        'blogs':blogs
    })

def blog_detail(request, slug):
    blog = get_object_or_404(
        Blog,
        slug=slug
    )

    return render(
        request,
        'blog_detail.html',
        {'blog':blog}
    )




def quiz_page(request):

    quizzes=Quiz.objects.prefetch_related(
        'questions'
    )

    return render(
        request,
        'quiz.html',
        {
            'quizzes':quizzes
        }
    )




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

        return JsonResponse({
            "success": True
        })


    return JsonResponse({
        "success": False
    })