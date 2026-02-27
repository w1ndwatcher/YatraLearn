from django.urls import path
from .views import CreateReflectionSession, TrainerReflectionListView, ReflectionSessionDetailView, SessionParticipantsView, DeleteParticipantView

urlpatterns = [
    path("create/", CreateReflectionSession.as_view()),
    path("list/", TrainerReflectionListView.as_view()),
    path("<int:pk>/", ReflectionSessionDetailView.as_view()),
    path("<int:session_id>/participants/", SessionParticipantsView.as_view()),
    path("participants/<int:pk>/delete/", DeleteParticipantView.as_view()),
]