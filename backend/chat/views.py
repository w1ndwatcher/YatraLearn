from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .serializers import ChatHistorySerializer
from reflections.models import ParticipantProfile
from .models import ChatHistory
from .llm_service import generate_chat_response

# Create your views here.
class ParticipantChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        participant = request.user.participantprofile
        print(participant)
        if participant.status == "INVITED":
            participant.status = "STARTED"
            participant.save()

        user_message = request.data.get("message")
        print(user_message)
        # Save user message
        ChatHistory.objects.create(
            session=participant.session,
            participant=participant,
            message_role="user",
            message_text=user_message
        )

        # Generate LLM response
        ai_response = generate_chat_response(participant, user_message)

        # Save AI message
        ChatHistory.objects.create(
            session=participant.session,
            participant=participant,
            message_role="assistant",
            message_text=ai_response
        )

        return Response({"reply": ai_response})
    
class ParticipantChatHistoryView(ListAPIView):
    serializer_class = ChatHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        participant = self.request.user.participantprofile
        return ChatHistory.objects.filter(
            participant=participant
        ).order_by("timestamp")