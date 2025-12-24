from .models import Geolocation


def geolocation_queryset():
    return Geolocation.objects.all()
