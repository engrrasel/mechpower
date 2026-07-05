from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('web.urls')),
    path("solar-calculator/", include("solar_designer.urls")),
    path("app/", include("voltmatrix_app.urls")),
    path("blog/", include("blog.urls")),
    path("skill-test/", include("skill_test.urls")),
    path("certificate/", include("certificate.urls")),
    path("contact/", include("contact.urls")),


    path(
        "certificate/",
        include(
            "certificate.urls"
        )
    ),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)