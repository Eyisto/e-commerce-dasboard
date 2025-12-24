from django.db.models import Avg, Count, F, OuterRef, Q, Subquery, Sum

from apps.catalog.infrastructure.models import CategoryTranslation

from apps.analytics.infrastructure import selectors


def top_products(filters, limit=10):
    qs = selectors.filtered_orderitem_queryset(filters)
    category_english = Subquery(
        CategoryTranslation.objects.filter(
            product_category_name=OuterRef("product__product_category_name")
        ).values("product_category_name_english")[:1]
    )
    results = (
        qs.values("product_id", "product__product_category_name")
        .annotate(
            gmv=Sum("price"),
            total_sold=Count("id"),
            category_english=category_english,
        )
        .order_by("-gmv")[:limit]
    )
    payload = []
    for row in results:
        category = row["product__product_category_name"] or "unknown"
        payload.append(
            {
                "product_id": row["product_id"],
                "product_name": row["product_id"],
                "category": category,
                "category_english": row["category_english"] or category,
                "total_sold": row["total_sold"],
                "gmv": row["gmv"],
            }
        )
    return payload


def top_categories(filters, limit=10):
    qs = selectors.filtered_orderitem_queryset(filters)
    category_english = Subquery(
        CategoryTranslation.objects.filter(
            product_category_name=OuterRef("product__product_category_name")
        ).values("product_category_name_english")[:1]
    )
    results = (
        qs.values("product__product_category_name")
        .annotate(
            gmv=Sum("price"),
            total_sold=Count("id"),
            category_english=category_english,
        )
        .order_by("-gmv")[:limit]
    )
    payload = []
    for row in results:
        category = row["product__product_category_name"] or "unknown"
        payload.append(
            {
                "category": category,
                "category_english": row["category_english"] or category,
                "total_sold": row["total_sold"],
                "gmv": row["gmv"],
            }
        )
    return payload


def top_sellers(filters, limit=10):
    qs = selectors.filtered_orderitem_queryset(filters)
    results = (
        qs.values("seller_id", "seller__seller_city", "seller__seller_state")
        .annotate(
            gmv=Sum("price"),
            orders_count=Count("order_id", distinct=True),
            avg_review_score=Avg("order__orderreview__review_score"),
            late_orders=Count(
                "order_id",
                filter=Q(order__order_delivered_customer_date__gt=F("order__order_estimated_delivery_date")),
                distinct=True,
            ),
            total_orders=Count("order_id", distinct=True),
        )
        .order_by("-gmv")[:limit]
    )
    payload = []
    for row in results:
        total_orders = row["total_orders"] or 0
        late_orders = row["late_orders"] or 0
        late_rate = (late_orders / total_orders * 100) if total_orders else 0
        payload.append(
            {
                "seller_id": row["seller_id"],
                "seller_city": row["seller__seller_city"],
                "seller_state": row["seller__seller_state"],
                "orders_count": row["orders_count"],
                "gmv": row["gmv"],
                "avg_review_score": row["avg_review_score"] or 0,
                "late_delivery_rate": late_rate,
            }
        )
    return payload
