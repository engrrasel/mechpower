from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import (
    Project,
    Blog,
    Quiz,
    Contact,
    QuizSubmission
)

import json

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




def home(request):

    if request.method == "POST":

        Contact.objects.create(
            full_name=request.POST.get("full_name"),
            company=request.POST.get("company"),
            email=request.POST.get("email"),
            phone=request.POST.get("phone"),
            service=request.POST.get("service"),
            message=request.POST.get("message"),
        )

        return redirect('/')

    projects = Project.objects.all().order_by('-created_at')
    blogs = Blog.objects.all().order_by('-created_at')

    return render(
        request,
        'index.html',
        {
            'projects': projects,
            'blogs': blogs
        }
    )