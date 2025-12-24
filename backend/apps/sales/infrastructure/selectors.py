from .models import Order, OrderItem


def order_queryset():
    return Order.objects.select_related("customer")


def order_item_queryset():
    return OrderItem.objects.select_related("order", "product", "seller", "order__customer")
