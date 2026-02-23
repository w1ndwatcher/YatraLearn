from django.db import models
from reflections.models import ReflectionSession, ParticipantProfile

class ChatHistory(models.Model):
    ROLE_CHOICES = [('system', 'System'), ('user', 'User'), ('assistant', 'Assistant')]
    session = models.ForeignKey(ReflectionSession, on_delete=models.CASCADE)
    participant = models.ForeignKey(ParticipantProfile, on_delete=models.CASCADE)
    message_role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    message_text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

class ChatSummary(models.Model):
    participant = models.ForeignKey(ParticipantProfile, on_delete=models.CASCADE)
    summary_text = models.TextField()
    learning_alignment_score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

class ParticipantGoal(models.Model):
    STATUS_CHOICES = [('ACTIVE', 'Active'), ('COMPLETED', 'Completed')]
    participant = models.ForeignKey(ParticipantProfile, on_delete=models.CASCADE)
    goal_text = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    reminder_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)