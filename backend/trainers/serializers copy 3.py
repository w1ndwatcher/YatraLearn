from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TrainerProfile, TrainerEducation, TrainerPastClient, TrainerTestimonial
from users.models import UserProfile
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings
from django.db import transaction


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
    education = TrainerEducationSerializer(many=True)
    past_clients = TrainerPastClientSerializer(many=True)
    testimonials = TrainerTestimonialSerializer(many=True)

    class Meta:
        model = TrainerProfile
        fields = [
            'area_of_expertise', 'audience', 'cv',
            'education', 'past_clients', 'testimonials'
        ]

    extra_kwargs = {
        'cv': {'required': False}
    }

    @transaction.atomic
    def create(self, validated_data):
        education_data = validated_data.pop("education", [])
        clients_data = validated_data.pop("past_clients", [])
        testimonial_data = validated_data.pop("testimonials", [])

        request = self.context["request"]

        # User-related fields from POST
        name = request.POST.get("name")
        email = request.POST.get("email")
        contact = request.POST.get("contact")
        city = request.POST.get("city")
        state = request.POST.get("state")
        country = request.POST.get("country")
        bio = request.POST.get("bio")
        linkedin = request.POST.get("linkedin")
        instagram = request.POST.get("instagram")
        website = request.POST.get("website")
        blog = request.POST.get("blog")

        # Username and random password generation
        username = email.split("@")[0]
        password = get_random_string(8)

        # Create user
        user = User.objects.create_user(username=username, email=email, password=password)

        # Create user profile
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

        # Create main trainer profile
        trainer = TrainerProfile.objects.create(user=user, **validated_data)

        # Create nested education entries
        for edu in education_data:
            TrainerEducation.objects.create(trainer=trainer, **edu)

        # Create past clients
        for c in clients_data:
            TrainerPastClient.objects.create(trainer=trainer, **c)

        # Create testimonials
        for t in testimonial_data:
            TrainerTestimonial.objects.create(trainer=trainer, **t)

        # -----------------------------------
        # ✅ SEND EMAIL WITH CREDENTIALS HERE
        # -----------------------------------
        try:
            send_mail(
                subject="Your Trainer Account Credentials",
                message=(
                    f"Hello {name},\n\n"
                    f"Your trainer account has been created successfully.\n\n"
                    f"Login Details:\n"
                    f"Username: {username}\n"
                    f"Password: {password}\n\n"
                    f"Please log in and reset your password.\n\n"
                    f"Thank you!"
                ),
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=True,
            )
        except Exception as e:
            print("Email send error:", e)

        return trainer