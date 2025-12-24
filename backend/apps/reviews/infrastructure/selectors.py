from .models import OrderReview


def review_queryset():
    return OrderReview.objects.select_related("order")
