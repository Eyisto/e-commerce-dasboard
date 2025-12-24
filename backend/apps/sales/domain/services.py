from decimal import Decimal

from django.db.models import Sum

from apps.sales.infrastructure.selectors import order_item_queryset


def calculate_gmv(filters=None):
    qs = order_item_queryset()
    if filters:
        qs = filters(qs)
    total = qs.aggregate(total=Sum("price"))["total"]
    return total or Decimal("0.00")
