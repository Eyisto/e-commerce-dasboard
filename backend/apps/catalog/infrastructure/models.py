from django.db import models


class Product(models.Model):
    product_id = models.CharField(primary_key=True, max_length=32)
    product_category_name = models.CharField(max_length=64, null=True, blank=True)
    product_name_lenght = models.IntegerField(null=True, blank=True)
    product_description_lenght = models.IntegerField(null=True, blank=True)
    product_photos_qty = models.IntegerField(null=True, blank=True)
    product_weight_g = models.IntegerField(null=True, blank=True)
    product_length_cm = models.IntegerField(null=True, blank=True)
    product_height_cm = models.IntegerField(null=True, blank=True)
    product_width_cm = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = "olist_products"


class CategoryTranslation(models.Model):
    product_category_name = models.CharField(primary_key=True, max_length=64)
    product_category_name_english = models.CharField(max_length=64, null=True, blank=True)

    class Meta:
        db_table = "olist_category_translation"
