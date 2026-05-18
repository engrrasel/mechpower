from io import BytesIO
from pathlib import Path

from reportlab.lib.pagesizes import landscape, A4

from django.conf import settings
from django.core.files.base import ContentFile

from reportlab.pdfgen import canvas

from pypdf import (
    PdfReader,
    PdfWriter
)


def generate_certificate(
    certificate
):


    packet = BytesIO()

    c = canvas.Canvas(
        packet,
        pagesize=landscape(A4)
    )

    # Name
    c.setFont(
        "Times-BoldItalic",
        32
    )

    c.drawCentredString(
        420,
        340,
        certificate.participant_name
    )


    # Quiz Name
    c.setFont(
        "Helvetica-Bold",
        18
    )

    c.drawCentredString(
        420,
        280,
        certificate.quiz_name
    )


    # Score
    c.setFont(
        "Helvetica-Bold",
        18
    )

    c.drawString(
        170,
        205,
        f"{certificate.score}%"
    )


    # Grade
    c.drawString(
        415,
        205,
        certificate.grade
    )


    # Certificate Date
    c.setFont(
        "Helvetica-Bold",
        11
    )

    c.drawCentredString(
        680,
        205,
        certificate.created_at.strftime(
        "%d %b %Y"
    )
    )


    # Certificate ID
    c.setFont(
        "Helvetica",
        10
    )

    c.drawString(
        865,
        118,
        certificate.certificate_id
    )

    c.save()

    packet.seek(0)

    overlay = PdfReader(
        packet
    )

    template = Path(

        settings.BASE_DIR

        / "certificate"

        / "pdf_templates"

        / "certificate_base.pdf"
    )

    base = PdfReader(
        str(template)
    )

    page = base.pages[0]

    page.merge_page(
        overlay.pages[0]
    )

    output = PdfWriter()

    output.add_page(
        page
    )

    final = BytesIO()

    output.write(
        final
    )


    certificate.pdf.save(

        f"{certificate.certificate_id}.pdf",

        ContentFile(
            final.getvalue()
        ),

        save=True
    )

    return certificate