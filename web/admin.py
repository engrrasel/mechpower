from django.contrib import admin

from .models import (
    Project,
    Blog,
    QuizSubmission,
    Quiz,
    Question
)


class QuestionInline(
    admin.TabularInline
):
    model=Question
    extra=1


@admin.register(
Quiz
)
class QuizAdmin(
admin.ModelAdmin
):

    inlines=[
    QuestionInline
    ]


@admin.register(
QuizSubmission
)
class QuizSubmissionAdmin(
admin.ModelAdmin
):

    list_display=(

        'name',
        'quiz_name',
        'score',
        'percentage',
        'created_at'

    )

    search_fields=(

        'name',
        'email',
        'phone'

    )

    list_filter=(

        'quiz_name',
        'created_at'

    )



admin.site.register(
Project
)

admin.site.register(
Blog
)