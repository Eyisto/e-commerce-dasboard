from django.db import transaction

from apps.catalog.infrastructure.models import CategoryTranslation, Product
from apps.geo.infrastructure.models import Geolocation
from apps.reviews.infrastructure.models import OrderReview
from apps.sales.infrastructure.models import Customer, Order, OrderItem, Payment, Seller
from apps.ingestion.infrastructure.loaders.mappers import (
    map_category_translation,
    map_customer,
    map_geolocation,
    map_order,
    map_order_item,
    map_order_review,
    map_payment,
    map_product,
    map_seller,
)
from apps.ingestion.infrastructure.loaders.olist_csv_reader import read_csv
from apps.ingestion.infrastructure.reports import QualityReport


IMPORT_SEQUENCE = [
    ("product_category_name_translation.csv", CategoryTranslation, map_category_translation),
    ("olist_products_dataset.csv", Product, map_product),
    ("olist_customers_dataset.csv", Customer, map_customer),
    ("olist_sellers_dataset.csv", Seller, map_seller),
    ("olist_orders_dataset.csv", Order, map_order),
    ("olist_order_items_dataset.csv", OrderItem, map_order_item),
    ("olist_order_payments_dataset.csv", Payment, map_payment),
    ("olist_order_reviews_dataset.csv", OrderReview, map_order_review),
    ("olist_geolocation_dataset.csv", Geolocation, map_geolocation),
]


def _safe_bulk_create(model, batch, report, file_name, batch_size):
    if not batch:
        return
    try:
        model.objects.bulk_create(batch, batch_size=batch_size)
        report.record_inserted(file_name, count=len(batch))
    except Exception as exc:
        report.record_error(file_name, exc)
        for obj in batch:
            try:
                obj.save()
            except Exception as inner_exc:
                report.record_error(file_name, inner_exc)
                report.record_skipped(file_name)
            else:
                report.record_inserted(file_name)


def _truncate_tables():
    for model in [
        Geolocation,
        OrderReview,
        Payment,
        OrderItem,
        Order,
        Seller,
        Customer,
        Product,
        CategoryTranslation,
    ]:
        model.objects.all().delete()


@transaction.atomic
def import_olist(data_dir, truncate=False, limit=None, batch_size=5000):
    report = QualityReport()

    if truncate:
        _truncate_tables()

    for file_name, model, mapper in IMPORT_SEQUENCE:
        file_path = data_dir / file_name
        batch = []
        for row in read_csv(file_path, limit=limit):
            report.record_read(file_name)
            try:
                payload = mapper(row)
                if payload is None:
                    report.record_skipped(file_name)
                    continue
                batch.append(model(**payload))
                if len(batch) >= batch_size:
                    _safe_bulk_create(model, batch, report, file_name, batch_size)
                    batch = []
            except Exception as exc:
                report.record_error(file_name, exc)
                report.record_skipped(file_name)
        if batch:
            _safe_bulk_create(model, batch, report, file_name, batch_size)

    return report
