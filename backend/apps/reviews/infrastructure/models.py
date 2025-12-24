from django.db import models


class OrderReview(models.Model):
    review_id = models.CharField(primary_key=True, max_length=32)
    order = models.ForeignKey("sales.Order", on_delete=models.CASCADE)
    review_score = models.IntegerField()
    review_comment_title = models.TextField(null=True, blank=True)
    review_comment_message = models.TextField(null=True, blank=True)
    review_creation_date = models.DateTimeField(null=True, blank=True)
    review_answer_timestamp = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "olist_order_reviews"
