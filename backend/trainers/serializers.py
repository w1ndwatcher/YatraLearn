from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import transaction
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings

from .models import TrainerProfile, TrainerEducation, TrainerPastClient, TrainerTestimonial
from users.models import UserProfile


class TrainerEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainerEducation
        fields = ['name', 'agency', 'eligibility_date']


class TrainerPastClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainerPastClient
        fields = ['client_name', 'year']


class TrainerTestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainerTestimonial
        fields = ['testimonial_text', 'author_name', 'author_email']


class TrainerRegisterSerializer(serializers.ModelSerializer):

    # ✅ User fields (moved here properly)
    name = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    contact = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    linkedin = serializers.URLField(required=False, allow_blank=True)
    instagram = serializers.URLField(required=False, allow_blank=True)
    website = serializers.URLField(required=False, allow_blank=True)
    blog = serializers.URLField(required=False, allow_blank=True)

    # Nested
    education = TrainerEducationSerializer(many=True, required=False)
    past_clients = TrainerPastClientSerializer(many=True, required=False)
    testimonials = TrainerTestimonialSerializer(many=True, required=False)

    class Meta:
        model = TrainerProfile
        fields = [
            # User info
            'name', 'email', 'contact', 'city', 'state', 'country',
            'bio', 'linkedin', 'instagram', 'website', 'blog',

            # Trainer info
            'area_of_expertise', 'audience', 'cv',

            # Nested
            'education', 'past_clients', 'testimonials'
        ]

        extra_kwargs = {
            'cv': {'required': False}
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value

    @transaction.atomic
    def create(self, validated_data):

        # -----------------------------
        # Extract user fields
        # -----------------------------
        name = validated_data.pop("name")
        email = validated_data.pop("email")
        contact = validated_data.pop("contact", "")
        city = validated_data.pop("city", "")
        state = validated_data.pop("state", "")
        country = validated_data.pop("country", "India")
        bio = validated_data.pop("bio", "")
        linkedin = validated_data.pop("linkedin", "")
        instagram = validated_data.pop("instagram", "")
        website = validated_data.pop("website", "")
        blog = validated_data.pop("blog", "")

        # Extract nested
        education_data = validated_data.pop("education", [])
        clients_data = validated_data.pop("past_clients", [])
        testimonial_data = validated_data.pop("testimonials", [])

        # -----------------------------
        # Generate unique username
        # -----------------------------
        base_username = email.split("@")[0]
        username = base_username
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        password = get_random_string(10)

        # -----------------------------
        # Create Django User
        # -----------------------------
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=name
        )

        # -----------------------------
        # Create UserProfile
        # -----------------------------
        UserProfile.objects.create(
            user=user,
            role="TRAINER",
            contact=contact,
            city=city,
            state=state,
            country=country,
            bio=bio,
            linkedin=linkedin,
            instagram=instagram,
            website=website,
            blog=blog
        )

        # -----------------------------
        # Create TrainerProfile
        # -----------------------------
        trainer = TrainerProfile.objects.create(
            user=user,
            **validated_data
        )

        # -----------------------------
        # Create nested objects
        # -----------------------------
        for edu in education_data:
            TrainerEducation.objects.create(trainer=trainer, **edu)

        for client in clients_data:
            TrainerPastClient.objects.create(trainer=trainer, **client)

        for testimonial in testimonial_data:
            TrainerTestimonial.objects.create(trainer=trainer, **testimonial)

        # -----------------------------
        # Send Email
        # -----------------------------
        try:
            send_mail(
                subject="Your Trainer Account Credentials",
                message=(
                    f"Hello {name},\n\n"
                    f"Your trainer account has been created successfully.\n\n"
                    f"Login Details:\n"
                    f"Username: {username}\n"
                    f"Temporary Password: {password}\n\n"
                    f"Please log in and reset your password immediately.\n\n"
                    f"Thank you!"
                ),
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            print("Email sending failed:", str(e))

        return trainer