from django.db import models
import uuid


class Certificate(models.Model):

    participant_name = models.CharField(
        max_length=150
    )

    quiz_name = models.CharField(
        max_length=200
    )

    score = models.PositiveIntegerField(
        default=0
    )

    grade = models.CharField(
        max_length=20,
        blank=True
    )

    certificate_id = models.CharField(
        max_length=50,
        unique=True
    )

    pdf = models.FileField(
        upload_to="certificates/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def save(self,*args,**kwargs):

        if not self.certificate_id:

            code = str(
                uuid.uuid4()
            )[:8].upper()

            self.certificate_id = (
                f"MPS-{code}"
            )

        super().save(
            *args,
            **kwargs
        )


    def __str__(self):

        return self.certificate_id