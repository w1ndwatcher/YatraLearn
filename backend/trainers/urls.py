from django.urls import path
from .views import TrainerRegisterView

urlpatterns = [
    path('register/', TrainerRegisterView.as_view(), name='trainer-register'),
]