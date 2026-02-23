from rest_framework import generics, permissions
from .models import TrainerProfile
from .serializers import TrainerRegisterSerializer
from rest_framework.response import Response
from rest_framework import status

class TrainerRegisterView(generics.CreateAPIView):
    queryset = TrainerProfile.objects.all()
    serializer_class = TrainerRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Trainer registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)