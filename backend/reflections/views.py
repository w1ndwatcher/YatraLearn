from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import ReflectionCreateSerializer, ReflectionSessionListSerializer, ReflectionSessionDetailSerializer, ParticipantListSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView, DestroyAPIView
from .models import ReflectionSession, ParticipantProfile
from trainers.models import TrainerProfile
from django.shortcuts import get_object_or_404

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