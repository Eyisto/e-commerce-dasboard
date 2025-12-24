from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Product",
            fields=[
                ("product_id", models.CharField(max_length=32, primary_key=True, serialize=False)),
                ("product_category_name", models.CharField(blank=True, max_length=64, null=True)),
                ("product_name_lenght", models.IntegerField(blank=True, null=True)),
                ("product_description_lenght", models.IntegerField(blank=True, null=True)),
                ("product_photos_qty", models.IntegerField(blank=True, null=True)),
                ("product_weight_g", models.IntegerField(blank=True, null=True)),
                ("product_length_cm", models.IntegerField(blank=True, null=True)),
                ("product_height_cm", models.IntegerField(blank=True, null=True)),
                ("product_width_cm", models.IntegerField(blank=True, null=True)),
            ],
            options={"db_table": "olist_products"},
        ),
        migrations.CreateModel(
            name="CategoryTranslation",
            fields=[
                ("product_category_name", models.CharField(max_length=64, primary_key=True, serialize=False)),
                ("product_category_name_english", models.CharField(blank=True, max_length=64, null=True)),
            ],
            options={"db_table": "olist_category_translation"},
        ),
    ]
