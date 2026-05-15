from django.contrib import admin

from .models import (
    Project,
    Blog,
    QuizSubmission,
    Quiz,
    Question
)


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1


class QuizAdmin(admin.ModelAdmin):
    inlines = [QuestionInline]


admin.site.register(Project)

admin.site.register(Blog)

admin.site.register(QuizSubmission)

admin.site.register(
    Quiz,
    QuizAdmin
)