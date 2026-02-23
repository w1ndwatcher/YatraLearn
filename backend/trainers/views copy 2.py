import json
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import TrainerRegisterSerializer

class TrainerRegisterView(generics.CreateAPIView):
    serializer_class = TrainerRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data.copy()

        json_fields = [
            "area_of_expertise",
            "audience",
            "education",
            "past_clients",
            "testimonials",
        ]

        for field in json_fields:
            if field in data:
                try:
                    # handle case: DRF wraps JSON array into string
                    data[field] = json.loads(data[field])
                except Exception as e:
                    print(f"JSON decode error for {field}: {e}")
                    pass

        serializer = self.get_serializer(data=data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Trainer registered successfully"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)