from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("sales", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="OrderReview",
            fields=[
                ("review_id", models.CharField(max_length=32, primary_key=True, serialize=False)),
                ("review_score", models.IntegerField()),
                ("review_comment_title", models.TextField(blank=True, null=True)),
                ("review_comment_message", models.TextField(blank=True, null=True)),
                ("review_creation_date", models.DateTimeField(blank=True, null=True)),
                ("review_answer_timestamp", models.DateTimeField(blank=True, null=True)),
                (
                    "order",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="sales.order"),
                ),
            ],
            options={"db_table": "olist_order_reviews"},
        ),
    ]
