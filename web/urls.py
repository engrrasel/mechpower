from django.urls import path

from .views import (
    home,
    blog_detail,
    quiz_page,
    save_quiz,
    solar_package,  # এখানে সোলার প্যাকেজ ভিউটি ইমপোর্ট করা হলো
)

urlpatterns = [

    path(
        '',
        home,
        name='home'
    ),

    # সোলার প্যাকেজের পাথটি সঠিকভাবে ঠিক করে দেওয়া হলো
    path(
        'solar-package/', 
        solar_package, 
        name='solar_package'
    ),

    path(
        'blog/<slug:slug>/',
        blog_detail,
        name='blog_detail'
    ),

    path(
        'skill-test/',
        quiz_page,
        name='quiz'
    ),

    path(
        'save-quiz/',
        save_quiz,
        name='save_quiz'
    ),

]