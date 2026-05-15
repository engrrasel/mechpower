from django.urls import path
from .views import home, blog_detail, quiz_page

urlpatterns = [
    path('', home, name='home'),

    path(
        'blog/<slug:slug>/',
        blog_detail,
        name='blog_detail'
    ),

    path('skill-test/', quiz_page, name='quiz'),
]