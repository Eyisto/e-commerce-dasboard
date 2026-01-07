# Domain services for authentication business logic
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password


class AuthenticationService:
    """Service for handling authentication business logic"""
    
    @staticmethod
    def register_user(username: str, email: str, password: str, password2: str) -> User:
        """
        Register a new user with validation
        
        Args:
            username: Unique username
            email: User email address
            password: User password
            password2: Password confirmation
            
        Returns:
            Created User instance
            
        Raises:
            ValidationError: If validation fails
        """
        # Validate passwords match
        if password != password2:
            raise ValidationError("Passwords do not match")
        
        # Validate password strength
        validate_password(password)
        
        # Check if username already exists
        if User.objects.filter(username=username).exists():
            raise ValidationError("Username already exists")
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            raise ValidationError("Email already exists")
        
        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        return user
