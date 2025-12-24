from rest_framework.generics import ListAPIView

from apps.geo.api.serializers import GeolocationSerializer
from apps.geo.infrastructure.models import Geolocation


class GeolocationListView(ListAPIView):
    serializer_class = GeolocationSerializer
    queryset = Geolocation.objects.all().order_by("geolocation_zip_code_prefix")
