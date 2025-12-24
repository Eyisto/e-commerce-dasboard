from rest_framework import serializers

from apps.reviews.infrastructure.models import OrderReview


class OrderReviewSerializer(serializers.ModelSerializer):
    order_id = serializers.CharField(source="order.order_id")

    class Meta:
        model = OrderReview
        fields = [
            "review_id",
            "order_id",
            "review_score",
            "review_comment_title",
            "review_comment_message",
            "review_creation_date",
            "review_answer_timestamp",
        ]
