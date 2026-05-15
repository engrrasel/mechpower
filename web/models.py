from django.db import models
from django.utils.text import slugify

import uuid

class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(blank=True, unique=True)

    short_description = models.TextField()
    image = models.ImageField(upload_to='projects/')

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self,*args,**kwargs):
        if not self.slug:
            self.slug = slugify(self.title)

        super().save(*args,**kwargs)

    def __str__(self):
        return self.title




from django.db import models
from django.utils.text import slugify


class Blog(models.Model):

    MEDIA_CHOICES = (
        ('image', 'Image'),
        ('video', 'YouTube Video'),
    )

    title = models.CharField(
        max_length=200
    )

    slug = models.SlugField(
        blank=True,
        unique=True
    )

    media_type = models.CharField(
        max_length=20,
        choices=MEDIA_CHOICES,
        default='image'
    )

    image = models.ImageField(
        upload_to='blogs/',
        blank=True,
        null=True
    )

    youtube_link = models.URLField(
        blank=True,
        null=True
    )

    facebook_link = models.URLField(
        blank=True,
        null=True
    )

    tiktok_link = models.URLField(
        blank=True,
        null=True
    )

    short_description = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def save(self,*args,**kwargs):

        if not self.slug:
            self.slug = slugify(
                self.title
            )

        super().save(
            *args,
            **kwargs
        )

    def __str__(self):
        return self.title
    
    
class QuizSubmission(models.Model):

    name=models.CharField(
        max_length=150
    )

    email=models.EmailField()

    phone=models.CharField(
        max_length=30
    )

    quiz_name=models.CharField(
        max_length=100
    )

    score=models.IntegerField(
        default=0
    )

    total=models.IntegerField(
        default=0
    )

    percentage=models.IntegerField(
        default=0
    )

    answers=models.JSONField(
        default=list,
        blank=True
    )

    created_at=models.DateTimeField(
        auto_now_add=True
    )


    def __str__(self):

        return (
            f"{self.name} - "
            f"{self.score}/{self.total}"
        )


class Quiz(models.Model):
    title = models.CharField(max_length=200)
    short_title = models.CharField(max_length=50)

    def __str__(self):
        return self.title


class Question(models.Model):

    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name='questions'
    )

    question = models.TextField()

    option_a=models.CharField(max_length=300)
    option_b=models.CharField(max_length=300)
    option_c=models.CharField(max_length=300)
    option_d=models.CharField(max_length=300)

    correct=models.IntegerField(
        choices=[
            (0,'A'),
            (1,'B'),
            (2,'C'),
            (3,'D')
        ]
    )

    explanation=models.TextField()

    def __str__(self):
        return self.question[:60]
    


class Contact(models.Model):
    full_name = models.CharField(max_length=200)
    company = models.CharField(max_length=200, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    service = models.CharField(max_length=100)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name