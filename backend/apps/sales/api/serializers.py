from rest_framework import serializers


class OrderSerializer(serializers.Serializer):
    order_id = serializers.CharField()
    order_status = serializers.CharField()
    purchase_date = serializers.SerializerMethodField()
    delivered_date = serializers.SerializerMethodField()
    estimated_date = serializers.SerializerMethodField()
    items_count = serializers.SerializerMethodField()
    gmv = serializers.SerializerMethodField()
    customer_state = serializers.SerializerMethodField()
    customer_city = serializers.SerializerMethodField()

    def get_purchase_date(self, obj):
        if not obj.order_purchase_timestamp:
            return None
        return obj.order_purchase_timestamp.date().isoformat()

    def get_delivered_date(self, obj):
        if not obj.order_delivered_customer_date:
            return None
        return obj.order_delivered_customer_date.date().isoformat()

    def get_estimated_date(self, obj):
        if not obj.order_estimated_delivery_date:
            return None
        return obj.order_estimated_delivery_date.date().isoformat()

    def get_items_count(self, obj):
        return getattr(obj, "items_count", None) or 0

    def get_gmv(self, obj):
        value = getattr(obj, "gmv", None)
        return float(value) if value is not None else 0

    def get_customer_state(self, obj):
        return obj.customer.customer_state if obj.customer_id else None

    def get_customer_city(self, obj):
        return obj.customer.customer_city if obj.customer_id else None
