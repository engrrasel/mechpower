from django.urls import path

from . import views


urlpatterns = [

    path(

        "download/<str:certificate_id>/",

        views.download_certificate,

        name="download_certificate"
    ),

]