from django.contrib import admin

from .models import (
    Contact,
    Project,
    Blog,
    QuizSubmission,
    Quiz,
    Question
)


# Contact
admin.site.register(Contact)


# Project
admin.site.register(Project)


# Quiz Question Inline
class QuestionInline(
    admin.TabularInline
):
    model = Question
    extra = 1


# Quiz Admin
@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):

    list_display = [
        "title",
        "time_per_question",
        "get_total_time"
    ]

    def get_total_time(self,obj):

        total = obj.total_time()

        if total:
            return f"{total} sec"

        return "No Limit"

    get_total_time.short_description = (
        "Total Time"
    )

    inlines = [
        QuestionInline
    ]


# Quiz Submission Admin
@admin.register(QuizSubmission)
class QuizSubmissionAdmin(
    admin.ModelAdmin
):

    list_display = (
        'name',
        'quiz_name',
        'score',
        'percentage',
        'created_at'
    )

    search_fields = (
        'name',
        'email',
        'phone'
    )

    list_filter = (
        'quiz_name',
        'created_at'
    )


# Blog Admin
@admin.register(Blog)
class BlogAdmin(
    admin.ModelAdmin
):

    list_display = (
        'title',
        'created_at'
    )

    prepopulated_fields = {
        'slug': ('title',)
    }