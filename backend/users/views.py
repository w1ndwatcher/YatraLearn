from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.middleware.csrf import get_token


class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password required."}, status=400)

        user = authenticate(username=username, password=password)

        if not user:
            return Response({"error": "Invalid credentials."}, status=400)

        login(request, user)
        csrf_token = get_token(request)
        print(csrf_token)
        profile = user.userprofile

        return Response({
            "username": user.username,
            "role": profile.role,
            "must_change_password": profile.must_change_password,
            "csrfToken": csrf_token
        })


class ChangePasswordView(APIView):
    def post(self, request):
        # if not request.user.is_authenticated:
        #     return Response({"error": "Authentication required."}, status=401)
        print(request.user)
        
        new_password = request.data.get("new_password")

        if not new_password:
            return Response({"error": "New password required."}, status=400)

        try:
            validate_password(new_password, request.user)
        except ValidationError as e:
            return Response({"error": list(e.messages)}, status=400)

        if request.user.check_password(new_password):
            return Response({"error": "Cannot reuse current password."}, status=400)

        request.user.set_password(new_password)
        request.user.save()

        profile = request.user.userprofile
        profile.must_change_password = False
        profile.save()

        return Response({"message": "Password updated successfully."})


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully."})
