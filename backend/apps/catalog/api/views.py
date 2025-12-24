from rest_framework.generics import ListAPIView

from apps.catalog.api.serializers import ProductSerializer
from apps.catalog.infrastructure.selectors import product_queryset


class ProductListView(ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return product_queryset().order_by("product_id")
