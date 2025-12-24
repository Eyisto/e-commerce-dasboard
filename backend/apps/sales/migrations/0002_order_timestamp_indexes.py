from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("sales", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="order",
            name="order_purchase_timestamp",
            field=models.DateTimeField(blank=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name="order",
            name="order_delivered_customer_date",
            field=models.DateTimeField(blank=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name="order",
            name="order_estimated_delivery_date",
            field=models.DateTimeField(blank=True, db_index=True, null=True),
        ),
    ]
