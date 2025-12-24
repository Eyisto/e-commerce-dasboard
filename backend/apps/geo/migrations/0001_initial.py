from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Geolocation",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("geolocation_zip_code_prefix", models.IntegerField()),
                ("geolocation_lat", models.DecimalField(decimal_places=7, max_digits=10)),
                ("geolocation_lng", models.DecimalField(decimal_places=7, max_digits=10)),
                ("geolocation_city", models.CharField(max_length=64)),
                ("geolocation_state", models.CharField(max_length=8)),
            ],
            options={"db_table": "olist_geolocation"},
        ),
        migrations.AddIndex(
            model_name="geolocation",
            index=models.Index(fields=["geolocation_zip_code_prefix"], name="geo_zip_prefix_idx"),
        ),
    ]
