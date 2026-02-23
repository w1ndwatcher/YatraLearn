from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TrainerProfile, TrainerEducation, TrainerPastClient, TrainerTestimonial
from users.models import UserProfile
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings


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

    # include user-related fields
    extra_kwargs = {
        'cv': {'required': False}
    }

    def create(self, validated_data):
        # pop nested data
        education_data = validated_data.pop('education', [])
        clients_data = validated_data.pop('past_clients', [])
        testimonial_data = validated_data.pop('testimonials', [])

        # create trainer user
        name = self.context['request'].data.get('name')
        email = self.context['request'].data.get('email')
        contact = self.context['request'].data.get('contact')
        city = self.context['request'].data.get('city')
        state = self.context['request'].data.get('state')
        country = self.context['request'].data.get('country')
        bio = self.context['request'].data.get('bio')
        linkedin = self.context['request'].data.get('linkedin')
        instagram = self.context['request'].data.get('instagram')
        website = self.context['request'].data.get('website')
        blog = self.context['request'].data.get('blog')

        username = email.split('@')[0]
        password = get_random_string(length=8)

        user = User.objects.create_user(username=username, email=email, password=password)
        profile = UserProfile.objects.create(
            user=user, role='TRAINER', contact=contact, city=city, state=state,
            country=country, bio=bio, linkedin=linkedin, instagram=instagram,
            website=website, blog=blog
        )

        trainer = TrainerProfile.objects.create(user=user, **validated_data)

        for edu in education_data:
            TrainerEducation.objects.create(trainer=trainer, **edu)
        for client in clients_data:
            TrainerPastClient.objects.create(trainer=trainer, **client)
        for t in testimonial_data:
            TrainerTestimonial.objects.create(trainer=trainer, **t)

        # send credentials email
        try:
            send_mail(
                subject="Your Trainer Account Created",
                message=f"Hello {name},\n\nYour trainer account has been created.\nUsername: {username}\nPassword: {password}\n\nPlease login and reset your password.",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=True,
            )
        except Exception as e:
            print("Email send error:", e)

        return trainer