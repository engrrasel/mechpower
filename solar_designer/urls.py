from django.urls import path
from . import views

app_name = "solar_designer"

urlpatterns = [
    # এখানে views.solar_home পরিবর্তন করে views.home করা হলো
    path('', views.home, name='solar_designer_home'),
]