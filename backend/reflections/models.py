from django.db import models
from trainers.models import TrainerProfile
from django.contrib.auth.models import User

class ReflectionSession(models.Model):
    trainer = models.ForeignKey(TrainerProfile, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    learning_objectives = models.JSONField(default=list)
    duration_from = models.DateField()
    duration_to = models.DateField()
    design = models.TextField()
    execution = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ParticipantProfile(models.Model):
    session = models.ForeignKey(ReflectionSession, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    role = models.CharField(max_length=100)
    years_experience = models.IntegerField()
    department = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='India')
    comments = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ParticipantCredentials(models.Model):
    participant = models.OneToOneField(ParticipantProfile, on_delete=models.CASCADE)
    username = models.CharField(max_length=255)
    password_hash = models.CharField(max_length=255)
    is_default = models.BooleanField(default=True)
    last_login = models.DateTimeField(null=True, blank=True)