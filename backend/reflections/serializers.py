from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings
from users.models import UserProfile
from trainers.models import TrainerProfile
from .models import ReflectionSession, ParticipantProfile


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

            base_username = p["email"].split("@")[0]
            username = base_username
            counter = 1

            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1

            password = get_random_string(8)

            user = User.objects.create_user(
                username=username,
                email=p["email"],
                password=password
            )

            UserProfile.objects.create(
                user=user,
                role="TRAINEE",
                must_change_password=True
            )

            participant = ParticipantProfile.objects.create(
                session=session,
                user=user,
                **p
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
    

class ReflectionSessionListSerializer(serializers.ModelSerializer):

    total_participants = serializers.SerializerMethodField()
    started_count = serializers.SerializerMethodField()
    completed_count = serializers.SerializerMethodField()

    class Meta:
        model = ReflectionSession
        fields = [
            "id",
            "title",
            "duration_from",
            "duration_to",
            "total_participants",
            "started_count",
            "completed_count",
        ]

    def get_total_participants(self, obj):
        return obj.participantprofile_set.count()

    def get_started_count(self, obj):
        return obj.participantprofile_set.filter(status="STARTED").count()

    def get_completed_count(self, obj):
        return obj.participantprofile_set.filter(status="COMPLETED").count()
    
class ReflectionSessionDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = ReflectionSession
        fields = [
            "id",
            "title",
            "learning_objectives",
            "duration_from",
            "duration_to",
            "design",
            "execution",
        ]
        
class ParticipantListSerializer(serializers.ModelSerializer):

    class Meta:
        model = ParticipantProfile
        fields = [
            "id",
            "name",
            "email",
            "role",
            "years_experience",
            "department",
            "city",
            "state",
            "country",
            "status",
        ]

class AddParticipantSerializer(serializers.ModelSerializer):

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
        
        
class ParticipantSessionSerializer(serializers.ModelSerializer):

    class Meta:
        model = ReflectionSession
        fields = [
            "id",
            "title",
            "duration_from",
            "duration_to",
        ]
        

class ParticipantProfileSerializer(serializers.ModelSerializer):

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
        read_only_fields = ["email"]