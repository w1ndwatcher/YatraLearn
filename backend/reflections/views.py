from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import ReflectionCreateSerializer, ReflectionSessionListSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import ListAPIView
from .models import ReflectionSession
from trainers.models import TrainerProfile

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