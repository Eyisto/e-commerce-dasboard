import os
import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth import get_user_model

def create_initial_superuser():
    User = get_user_model()
    email = "eyisto@mail.com"
    password = "admin123"
    username = "admin"

    if not User.objects.filter(email=email).exists():
        print(f"Creando superusuario: {email}")
        User.objects.create_superuser(username=username, email=email, password=password)
        print("Superusuario creado exitosamente")
    else:
        print("El superusuario ya existe")

if __name__ == "__main__":
    create_initial_superuser()
