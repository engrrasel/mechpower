from django.urls import path
from . import views

app_name = "voltmatrix_app"

urlpatterns = [
    path("", views.dashboard, name="dashboard"),
]