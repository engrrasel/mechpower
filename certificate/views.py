from django.http import FileResponse

from django.shortcuts import (
    get_object_or_404
)

from .models import (
    Certificate
)


def download_certificate(
    request,
    certificate_id
):

    certificate = (
        get_object_or_404(

            Certificate,

            certificate_id=
            certificate_id
        )
    )

    return FileResponse(

        certificate.pdf.open(
            "rb"
        ),

        as_attachment=True
    )