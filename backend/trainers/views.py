import json
from rest_framework import generics, permissions
from .models import TrainerProfile
from .serializers import TrainerRegisterSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password

class TrainerRegisterView(generics.CreateAPIView):
    queryset = TrainerProfile.objects.all()
    serializer_class = TrainerRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.POST.dict()
        files = request.FILES

        # Parse JSON strings manually
        for field in ["area_of_expertise", "audience", "education", "past_clients", "testimonials"]:
            if field in data:
                try:
                    data[field] = json.loads(data[field])
                except:
                    return Response({field: ["Invalid JSON"]}, status=400)

        if "cv" in files:
            data["cv"] = files["cv"]

        serializer = self.get_serializer(data=data, context={"request": request})

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Trainer registered successfully!"}, status=201)

        return Response(serializer.errors, status=400)