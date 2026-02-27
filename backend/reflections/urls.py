from django.urls import path
from .views import CreateReflectionSession, TrainerReflectionListView

urlpatterns = [
    path("create/", CreateReflectionSession.as_view()),
    path("list/", TrainerReflectionListView.as_view()),
]