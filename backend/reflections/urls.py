from django.urls import path
from .views import CreateReflectionSession, TrainerReflectionListView, ReflectionSessionDetailView, SessionParticipantsView, DeleteParticipantView, AddParticipantView, ParticipantDetailView, ParticipantLoginView, ParticipantSessionsView, ParticipantProfileView

urlpatterns = [
    path("create/", CreateReflectionSession.as_view()),
    path("list/", TrainerReflectionListView.as_view()),
    path("<int:pk>/", ReflectionSessionDetailView.as_view()),
    path("<int:session_id>/participants/", SessionParticipantsView.as_view()),
    path("participants/<int:pk>/delete/", DeleteParticipantView.as_view()),
    path("<int:session_id>/participants/add/", AddParticipantView.as_view()),
    path("participants/<int:pk>/", ParticipantDetailView.as_view()),
    path("participant-login/", ParticipantLoginView.as_view()),
    path("participant-sessions/", ParticipantSessionsView.as_view()),
    path("participant-profile/", ParticipantProfileView.as_view()),

]