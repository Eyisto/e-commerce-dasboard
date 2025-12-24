from django.db.models import Avg

from apps.geo.infrastructure.selectors import geolocation_queryset


def average_coords_by_zip():
    return (
        geolocation_queryset()
        .values("geolocation_zip_code_prefix")
        .annotate(
            avg_lat=Avg("geolocation_lat"),
            avg_lng=Avg("geolocation_lng"),
        )
        .order_by("geolocation_zip_code_prefix")
    )
