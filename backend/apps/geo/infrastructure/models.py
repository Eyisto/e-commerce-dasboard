from django.db import models


class Geolocation(models.Model):
    geolocation_zip_code_prefix = models.IntegerField()
    geolocation_lat = models.DecimalField(max_digits=10, decimal_places=7)
    geolocation_lng = models.DecimalField(max_digits=10, decimal_places=7)
    geolocation_city = models.CharField(max_length=64)
    geolocation_state = models.CharField(max_length=8)

    class Meta:
        db_table = "olist_geolocation"
        indexes = [
            models.Index(fields=["geolocation_zip_code_prefix"], name="geo_zip_prefix_idx"),
        ]
