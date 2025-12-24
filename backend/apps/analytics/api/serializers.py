from rest_framework import serializers


class KPIResponseSerializer(serializers.Serializer):
    gmv = serializers.DecimalField(max_digits=12, decimal_places=2)
    orders_count = serializers.IntegerField()
    items_sold = serializers.IntegerField()
    aov = serializers.DecimalField(max_digits=12, decimal_places=2)
    paid_total = serializers.DecimalField(max_digits=12, decimal_places=2)


class SalesByDaySerializer(serializers.Serializer):
    date = serializers.DateField()
    gmv = serializers.DecimalField(max_digits=12, decimal_places=2)
    orders_count = serializers.IntegerField()


class TopProductSerializer(serializers.Serializer):
    product_id = serializers.CharField()
    product_name = serializers.CharField()
    category = serializers.CharField(allow_null=True)
    category_english = serializers.CharField(allow_null=True)
    total_sold = serializers.IntegerField()
    gmv = serializers.DecimalField(max_digits=12, decimal_places=2)


class TopCategorySerializer(serializers.Serializer):
    category = serializers.CharField(allow_null=True)
    category_english = serializers.CharField(allow_null=True)
    total_sold = serializers.IntegerField()
    gmv = serializers.DecimalField(max_digits=12, decimal_places=2)


class TopSellerSerializer(serializers.Serializer):
    seller_id = serializers.CharField()
    seller_city = serializers.CharField()
    seller_state = serializers.CharField()
    orders_count = serializers.IntegerField()
    gmv = serializers.DecimalField(max_digits=12, decimal_places=2)
    avg_review_score = serializers.FloatField(allow_null=True)
    late_delivery_rate = serializers.FloatField()


class LogisticsSerializer(serializers.Serializer):
    avgLeadTimeDays = serializers.FloatField()
    avgDelayDays = serializers.FloatField()
    lateOrdersCount = serializers.IntegerField()
    onTimeOrdersCount = serializers.IntegerField()
    deliveryByDay = serializers.ListField()
    deliveryByState = serializers.ListField()


class ReviewsMetricsSerializer(serializers.Serializer):
    avgScore = serializers.FloatField()
    scoreDistribution = serializers.ListField()
    topWorstCategories = serializers.ListField()
    topBestCategories = serializers.ListField()
