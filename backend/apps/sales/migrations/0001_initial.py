from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("catalog", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Customer",
            fields=[
                ("customer_id", models.CharField(max_length=32, primary_key=True, serialize=False)),
                ("customer_unique_id", models.CharField(max_length=32)),
                ("customer_zip_code_prefix", models.IntegerField()),
                ("customer_city", models.CharField(max_length=64)),
                ("customer_state", models.CharField(max_length=8)),
            ],
            options={"db_table": "olist_customers"},
        ),
        migrations.CreateModel(
            name="Seller",
            fields=[
                ("seller_id", models.CharField(max_length=32, primary_key=True, serialize=False)),
                ("seller_zip_code_prefix", models.IntegerField()),
                ("seller_city", models.CharField(max_length=64)),
                ("seller_state", models.CharField(max_length=8)),
            ],
            options={"db_table": "olist_sellers"},
        ),
        migrations.CreateModel(
            name="Order",
            fields=[
                ("order_id", models.CharField(max_length=32, primary_key=True, serialize=False)),
                ("order_status", models.CharField(max_length=32)),
                ("order_purchase_timestamp", models.DateTimeField(blank=True, null=True)),
                ("order_approved_at", models.DateTimeField(blank=True, null=True)),
                ("order_delivered_carrier_date", models.DateTimeField(blank=True, null=True)),
                ("order_delivered_customer_date", models.DateTimeField(blank=True, null=True)),
                ("order_estimated_delivery_date", models.DateTimeField(blank=True, null=True)),
                (
                    "customer",
                    models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to="sales.customer"),
                ),
            ],
            options={"db_table": "olist_orders"},
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("order_item_id", models.IntegerField()),
                ("shipping_limit_date", models.DateTimeField(blank=True, null=True)),
                ("price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("freight_value", models.DecimalField(decimal_places=2, max_digits=10)),
                (
                    "order",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="sales.order"),
                ),
                (
                    "product",
                    models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to="catalog.product"),
                ),
                (
                    "seller",
                    models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to="sales.seller"),
                ),
            ],
            options={
                "db_table": "olist_order_items",
            },
        ),
        migrations.CreateModel(
            name="Payment",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("payment_sequential", models.IntegerField()),
                ("payment_type", models.CharField(max_length=32)),
                ("payment_installments", models.IntegerField()),
                ("payment_value", models.DecimalField(decimal_places=2, max_digits=10)),
                (
                    "order",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="sales.order"),
                ),
            ],
            options={"db_table": "olist_order_payments"},
        ),
        migrations.AddConstraint(
            model_name="orderitem",
            constraint=models.UniqueConstraint(fields=("order", "order_item_id"), name="uniq_order_item"),
        ),
        migrations.AddConstraint(
            model_name="payment",
            constraint=models.UniqueConstraint(fields=("order", "payment_sequential"), name="uniq_order_payment_seq"),
        ),
    ]
