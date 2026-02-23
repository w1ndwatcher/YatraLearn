import uuid
from django.db import models
from django.contrib.auth.models import User

class EmailVerification(models.Model):
    STATUS_CHOICES = [('PENDING', 'Pending'), ('VERIFIED', 'Verified')]
    token = models.UUIDField(default=uuid.uuid4)
    email = models.EmailField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)

class Notification(models.Model):
    STATUS_CHOICES = [('UNREAD', 'Unread'), ('READ', 'Read')]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='UNREAD')