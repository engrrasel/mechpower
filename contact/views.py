from django.shortcuts import render


def contact(request):
    return render(request, "contact/contact.html")


def success(request):
    return render(request, "contact/success.html")