from django.shortcuts import render


def dashboard(request):
    return render(request, "voltmatrix_app/dashboard.html")