from django.urls import path
from .views import CreateReflectionSession

urlpatterns = [
    path("create/", CreateReflectionSession.as_view()),
]