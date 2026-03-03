from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import ReflectionCreateSerializer, ReflectionSessionListSerializer, ReflectionSessionDetailSerializer, ParticipantListSerializer, AddParticipantSerializer, ParticipantProfileSerializer, ParticipantSessionSerializer
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView, DestroyAPIView, CreateAPIView
from .models import ReflectionSession, ParticipantProfile
from trainers.models import TrainerProfile
from users.models import UserProfile
from django.shortcuts import get_object_or_404
from django.utils.crypto import get_random_string
from django.contrib.auth import authenticate, login
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return

class CreateReflectionSession(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = ReflectionCreateSerializer(
            data=request.data,
            context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Reflection session created"})
        return Response(serializer.errors, status=400)

class TrainerReflectionListView(ListAPIView):
    serializer_class = ReflectionSessionListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        trainer = TrainerProfile.objects.get(user=self.request.user)
        return ReflectionSession.objects.filter(trainer=trainer).order_by("-created_at")
    
class ReflectionSessionDetailView(RetrieveUpdateAPIView):
    serializer_class = ReflectionSessionDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        trainer = TrainerProfile.objects.get(user=self.request.user)
        return ReflectionSession.objects.filter(trainer=trainer)

class SessionParticipantsView(ListAPIView):
    serializer_class = ParticipantListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        trainer = TrainerProfile.objects.get(user=self.request.user)
        session_id = self.kwargs["session_id"]

        session = get_object_or_404(
            ReflectionSession,
            id=session_id,
            trainer=trainer
        )

        return ParticipantProfile.objects.filter(session=session)
    
class DeleteParticipantView(DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        trainer = TrainerProfile.objects.get(user=self.request.user)
        return ParticipantProfile.objects.filter(
            session__trainer=trainer
        )
        
class AddParticipantView(CreateAPIView):
    serializer_class = AddParticipantSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        trainer = TrainerProfile.objects.get(user=self.request.user)
        session_id = self.kwargs["session_id"]

        session = get_object_or_404(
            ReflectionSession,
            id=session_id,
            trainer=trainer
        )

        data = serializer.validated_data

        # Generate username
        base_username = data["email"].split("@")[0]
        username = base_username
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        password = get_random_string(8)

        # Create Django User (PASSWORD AUTO HASHED)
        user = User.objects.create_user(
            username=username,
            email=data["email"],
            password=password
        )

        # Create role profile
        UserProfile.objects.create(
            user=user,
            role="TRAINEE",
            must_change_password=True
        )

        # Create participant profile
        participant = serializer.save(
            session=session,
            user=user
        )

        # Send email
        send_mail(
            subject="You're Invited to a Reflection Session",
            message=(
                f"Hello {participant.name},\n\n"
                f"You have been invited to a reflection session.\n\n"
                f"Username: {username}\n"
                f"Password: {password}\n\n"
                f"Please login and begin your reflection."
            ),
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[participant.email],
            fail_silently=False,
        )

class ParticipantDetailView(RetrieveUpdateAPIView):
    serializer_class = ParticipantListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        trainer = TrainerProfile.objects.get(user=self.request.user)
        return ParticipantProfile.objects.filter(
            session__trainer=trainer
        )

class ParticipantLoginView(APIView):

    authentication_classes = [CsrfExemptSessionAuthentication]

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if not user:
            return Response({"error": "Invalid credentials"}, status=400)

        profile = user.userprofile

        if profile.role != "TRAINEE":
            return Response({"error": "Not a participant account"}, status=403)

        login(request, user)

        return Response({
            "username": user.username,
            "must_change_password": profile.must_change_password
        })

class ParticipantSessionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.userprofile.role != "TRAINEE":
            return Response({"error": "Not allowed"}, status=403)

        participant = request.user.participantprofile
        session = participant.session

        data = {
            "id": session.id,
            "title": session.title,
            "duration_from": session.duration_from,
            "duration_to": session.duration_to,
            "status": participant.status
        }

        return Response([data])
    
class ParticipantProfileView(RetrieveUpdateAPIView):
    serializer_class = ParticipantProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        if self.request.user.userprofile.role != "TRAINEE":
            raise PermissionDenied("Not allowed")

        return self.request.user.participantprofile