from .models import Product


def product_queryset():
    return Product.objects.all()
