import uuid
from django.db import models
from django.contrib.auth.models import User

class TrainerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    area_of_expertise = models.JSONField(default=list)
    audience = models.JSONField(default=list)
    cv = models.FileField(upload_to='cv/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class TrainerEducation(models.Model):
    trainer = models.ForeignKey(TrainerProfile, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    agency = models.CharField(max_length=255)
    eligibility_date = models.DateField()
    certificate = models.FileField(upload_to='certificates/', blank=True, null=True)

class TrainerPastClient(models.Model):
    trainer = models.ForeignKey(TrainerProfile, on_delete=models.CASCADE)
    client_name = models.CharField(max_length=255)
    year = models.IntegerField()

class TrainerTestimonial(models.Model):
    STATUS_CHOICES = [('UNVERIFIED', 'Unverified'), ('VERIFIED', 'Verified')]
    trainer = models.ForeignKey(TrainerProfile, on_delete=models.CASCADE)
    testimonial_text = models.TextField()
    author_name = models.CharField(max_length=255)
    author_email = models.EmailField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='UNVERIFIED')
    verification_token = models.UUIDField(default=uuid.uuid4)
    verified_at = models.DateTimeField(null=True, blank=True)