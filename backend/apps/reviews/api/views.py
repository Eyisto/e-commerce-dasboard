from rest_framework.generics import ListAPIView

from apps.reviews.api.serializers import OrderReviewSerializer
from apps.reviews.infrastructure.selectors import review_queryset


class OrderReviewListView(ListAPIView):
    serializer_class = OrderReviewSerializer

    def get_queryset(self):
        return review_queryset().order_by("review_creation_date")
