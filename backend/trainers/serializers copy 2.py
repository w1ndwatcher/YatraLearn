from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TrainerProfile, TrainerEducation, TrainerPastClient, TrainerTestimonial
from users.models import UserProfile
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings
import json


class TrainerEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainerEducation
        fields = ['name', 'agency', 'eligibility_date', 'certificate']


class TrainerPastClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainerPastClient
        fields = ['client_name', 'year']


class TrainerTestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainerTestimonial
        fields = ['testimonial_text', 'author_name', 'author_email']


class TrainerRegisterSerializer(serializers.ModelSerializer):
    education = TrainerEducationSerializer(many=True, write_only=True)
    past_clients = TrainerPastClientSerializer(many=True, write_only=True)
    testimonials = TrainerTestimonialSerializer(many=True, write_only=True)

    class Meta:
        model = TrainerProfile
        fields = [
            'area_of_expertise', 'audience', 'cv',
            'education', 'past_clients', 'testimonials'
        ]

    extra_kwargs = {
        'cv': {'required': False}
    }

    # 🔥 THIS FIXES YOUR ISSUE — PARSE JSON FIELDS
    def to_internal_value(self, data):
        data = data.copy()

        json_fields = ['education', 'past_clients', 'testimonials',
                       'area_of_expertise', 'audience']

        for field in json_fields:
            value = data.get(field)
            if isinstance(value, str):
                try:
                    data[field] = json.loads(value)
                except Exception:
                    pass  # leave as-is if not JSON

        return super().to_internal_value(data)

    def create(self, validated_data):
        # pop nested data
        education_data = validated_data.pop('education', [])
        clients_data = validated_data.pop('past_clients', [])
        testimonial_data = validated_data.pop('testimonials', [])

        # read non-model fields from request
        req = self.context['request'].data
        name = req.get('name')
        email = req.get('email')
        contact = req.get('contact')
        city = req.get('city')
        state = req.get('state')
        country = req.get('country')
        bio = req.get('bio')
        linkedin = req.get('linkedin')
        instagram = req.get('instagram')
        website = req.get('website')
        blog = req.get('blog')

        username = email.split('@')[0]
        password = get_random_string(length=8)

        # create Django user
        user = User.objects.create_user(username=username, email=email, password=password)

        # create profile
        UserProfile.objects.create(
            user=user, role='TRAINER', contact=contact, city=city, state=state,
            country=country, bio=bio, linkedin=linkedin, instagram=instagram,
            website=website, blog=blog
        )

        # create trainer profile
        trainer = TrainerProfile.objects.create(user=user, **validated_data)

        # create nested models
        for edu in education_data:
            TrainerEducation.objects.create(trainer=trainer, **edu)

        for client in clients_data:
            TrainerPastClient.objects.create(trainer=trainer, **client)

        for t in testimonial_data:
            TrainerTestimonial.objects.create(trainer=trainer, **t)

        # send creds email
        try:
            send_mail(
                subject="Your Trainer Account Created",
                message=f"Hello {name},\n\nYour trainer account has been created.\n"
                        f"Username: {username}\nPassword: {password}\n\nPlease login and reset your password.",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=True,
            )
        except Exception as e:
            print("Email send error:", e)

        return trainer