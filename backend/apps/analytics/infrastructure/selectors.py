from datetime import datetime, time, timedelta

from django.utils import timezone

from apps.sales.infrastructure.models import Order, OrderItem, Payment
from apps.reviews.infrastructure.models import OrderReview


def _datetime_range(filters):
    from_date = filters.get("from")
    to_date = filters.get("to")
    start = None
    end = None
    if from_date:
        start = datetime.combine(from_date, time.min)
        start = timezone.make_aware(start) if timezone.is_naive(start) else start
    if to_date:
        end = datetime.combine(to_date + timedelta(days=1), time.min)
        end = timezone.make_aware(end) if timezone.is_naive(end) else end
    return start, end


def _apply_common_order_filters(qs, filters):
    status = filters.get("status")
    state = filters.get("state")
    start, end = _datetime_range(filters)

    if start:
        qs = qs.filter(order_purchase_timestamp__gte=start)
    if end:
        qs = qs.filter(order_purchase_timestamp__lt=end)
    if status:
        qs = qs.filter(order_status=status)
    if state:
        qs = qs.filter(customer__customer_state=state)
    return qs


def filtered_order_queryset(filters):
    qs = Order.objects.select_related("customer")
    qs = _apply_common_order_filters(qs, filters)
    if filters.get("category") or filters.get("seller_id"):
        order_ids = filtered_orderitem_queryset(filters).values("order_id").distinct()
        qs = qs.filter(order_id__in=order_ids)
    return qs


def filtered_orderitem_queryset(filters):
    qs = OrderItem.objects.select_related("order", "product", "seller", "order__customer")
    status = filters.get("status")
    state = filters.get("state")
    category = filters.get("category")
    seller_id = filters.get("seller_id")
    start, end = _datetime_range(filters)

    if start:
        qs = qs.filter(order__order_purchase_timestamp__gte=start)
    if end:
        qs = qs.filter(order__order_purchase_timestamp__lt=end)
    if status:
        qs = qs.filter(order__order_status=status)
    if state:
        qs = qs.filter(order__customer__customer_state=state)
    if category:
        qs = qs.filter(product__product_category_name=category)
    if seller_id:
        qs = qs.filter(seller_id=seller_id)
    return qs


def filtered_payment_queryset(filters):
    order_ids = filtered_orderitem_queryset(filters).values("order_id").distinct()
    return Payment.objects.filter(order_id__in=order_ids)


def filtered_review_queryset(filters):
    order_ids = filtered_orderitem_queryset(filters).values("order_id").distinct()
    return OrderReview.objects.filter(order_id__in=order_ids)
