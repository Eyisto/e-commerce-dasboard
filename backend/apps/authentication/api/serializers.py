from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from apps.authentication.domain.services import AuthenticationService


class EmailTokenObtainPairSerializer(serializers.Serializer):
    """Accept email + password and return tokens + user info."""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist as exc:
            raise serializers.ValidationError("Invalid credentials.") from exc

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid credentials.")

        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")

        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {"id": user.id, "username": user.username, "email": user.email},
        }


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def create(self, validated_data):
        try:
            user = AuthenticationService.register_user(**validated_data)
        except ValidationError as exc:
            raise serializers.ValidationError(exc.messages) from exc

        refresh = RefreshToken.for_user(user)
        return {
            "user": {"id": user.id, "username": user.username, "email": user.email},
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
