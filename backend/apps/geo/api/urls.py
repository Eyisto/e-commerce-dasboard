from django.urls import path

from .views import GeolocationListView

urlpatterns = [
    path("geo/locations/", GeolocationListView.as_view(), name="geo-locations"),
]
