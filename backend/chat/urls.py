from django.urls import path
from .views import (
    ParticipantChatView,
    ParticipantChatHistoryView,
)

urlpatterns = [
    path("", ParticipantChatView.as_view()),
    path("history/", ParticipantChatHistoryView.as_view()),
]