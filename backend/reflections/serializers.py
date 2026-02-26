from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings

from trainers.models import TrainerProfile
from .models import ReflectionSession, ParticipantProfile, ParticipantCredentials


class ParticipantSerializer(serializers.ModelSerializer):

    class Meta:
        model = ParticipantProfile
        fields = [
            "name",
            "email",
            "role",
            "years_experience",
            "department",
            "city",
            "state",
            "country",
            "comments",
        ]


class ReflectionCreateSerializer(serializers.ModelSerializer):

    participants = ParticipantSerializer(many=True)

    class Meta:
        model = ReflectionSession
        fields = [
            "title",
            "learning_objectives",
            "duration_from",
            "duration_to",
            "design",
            "execution",
            "participants",
        ]

    def create(self, validated_data):

        request = self.context["request"]
        trainer = TrainerProfile.objects.get(user=request.user)

        participants_data = validated_data.pop("participants")

        session = ReflectionSession.objects.create(
            trainer=trainer,
            **validated_data
        )

        for p in participants_data:

            participant = ParticipantProfile.objects.create(
                session=session,
                **p
            )

            username = p["email"].split("@")[0]
            password = get_random_string(8)

            ParticipantCredentials.objects.create(
                participant=participant,
                username=username,
                password_hash=password,
            )

            # Send Invite Email
            send_mail(
                subject="Reflection Session Invite",
                message=f"""
Hello {participant.name},

You are invited to a reflection session.

Login Credentials:
Username: {username}
Password: {password}

Please login and start your reflection.

Thanks
                """,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[participant.email],
                fail_silently=True,
            )

        return session