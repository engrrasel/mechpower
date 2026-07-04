from django.shortcuts import render


def home(request):
    return render(request, "skill_test/home.html")


def quiz(request):
    return render(request, "skill_test/quiz.html")


def result(request):
    return render(request, "skill_test/result.html")


def leaderboard(request):
    return render(request, "skill_test/leaderboard.html")


def certificate(request):
    return render(request, "skill_test/certificate.html")