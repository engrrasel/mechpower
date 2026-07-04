from django.urls import path
from . import views

app_name = "skill_test"

urlpatterns = [
    path("", views.home, name="home"),
    path("quiz/", views.quiz, name="quiz"),
    path("result/", views.result, name="result"),
    path("leaderboard/", views.leaderboard, name="leaderboard"),
    path("certificate/", views.certificate, name="certificate"),
]