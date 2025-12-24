from django.db import models


class Customer(models.Model):
    customer_id = models.CharField(primary_key=True, max_length=32)
    customer_unique_id = models.CharField(max_length=32)
    customer_zip_code_prefix = models.IntegerField()
    customer_city = models.CharField(max_length=64)
    customer_state = models.CharField(max_length=8)

    class Meta:
        db_table = "olist_customers"


class Seller(models.Model):
    seller_id = models.CharField(primary_key=True, max_length=32)
    seller_zip_code_prefix = models.IntegerField()
    seller_city = models.CharField(max_length=64)
    seller_state = models.CharField(max_length=8)

    class Meta:
        db_table = "olist_sellers"


class Order(models.Model):
    order_id = models.CharField(primary_key=True, max_length=32)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    order_status = models.CharField(max_length=32)
    order_purchase_timestamp = models.DateTimeField(null=True, blank=True, db_index=True)
    order_approved_at = models.DateTimeField(null=True, blank=True)
    order_delivered_carrier_date = models.DateTimeField(null=True, blank=True)
    order_delivered_customer_date = models.DateTimeField(null=True, blank=True, db_index=True)
    order_estimated_delivery_date = models.DateTimeField(null=True, blank=True, db_index=True)

    class Meta:
        db_table = "olist_orders"


class OrderItem(models.Model):
    # Auto PK with unique constraint for (order, order_item_id) from the source dataset.
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    order_item_id = models.IntegerField()
    product = models.ForeignKey("catalog.Product", on_delete=models.PROTECT)
    seller = models.ForeignKey(Seller, on_delete=models.PROTECT)
    shipping_limit_date = models.DateTimeField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    freight_value = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = "olist_order_items"
        constraints = [
            models.UniqueConstraint(fields=["order", "order_item_id"], name="uniq_order_item"),
        ]


class Payment(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    payment_sequential = models.IntegerField()
    payment_type = models.CharField(max_length=32)
    payment_installments = models.IntegerField()
    payment_value = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = "olist_order_payments"
        constraints = [
            models.UniqueConstraint(fields=["order", "payment_sequential"], name="uniq_order_payment_seq"),
        ]
