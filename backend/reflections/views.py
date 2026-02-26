from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import ReflectionCreateSerializer
from rest_framework.authentication import SessionAuthentication
from django.views.decorators.csrf import csrf_exempt

# class CsrfExemptSessionAuthentication(SessionAuthentication):
#     def enforce_csrf(self, request):
#         return

class CreateReflectionSession(APIView):
    # authentication_classes = [CsrfExemptSessionAuthentication]
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
