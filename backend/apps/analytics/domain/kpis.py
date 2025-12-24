from decimal import Decimal

from django.db.models import Avg, Count, OuterRef, Subquery, Sum

from apps.analytics.infrastructure import selectors
from apps.catalog.infrastructure.models import CategoryTranslation
from apps.sales.infrastructure.models import Order


def get_kpis(filters):
    item_qs = selectors.filtered_orderitem_queryset(filters)
    gmv = item_qs.aggregate(total=Sum("price"))["total"] or Decimal("0.00")
    items_sold = item_qs.count()
    order_ids = item_qs.values("order_id").distinct()
    orders_count = Order.objects.filter(order_id__in=order_ids).count()
    aov = gmv / orders_count if orders_count else Decimal("0.00")
    paid_total = selectors.filtered_payment_queryset(filters).aggregate(total=Sum("payment_value"))["total"] or Decimal("0.00")

    return {
        "gmv": gmv,
        "orders_count": orders_count,
        "items_sold": items_sold,
        "aov": aov,
        "paid_total": paid_total,
    }


def get_reviews_kpis(filters):
    avg_review_score = selectors.filtered_review_queryset(filters).aggregate(avg=Avg("review_score"))["avg"]
    return {"avg_review_score": avg_review_score or 0}


def get_reviews_metrics(filters, limit=5):
    reviews_qs = selectors.filtered_review_queryset(filters)
    total = reviews_qs.count()
    avg_score = reviews_qs.aggregate(avg=Avg("review_score"))["avg"] or 0
    distribution_raw = reviews_qs.values("review_score").annotate(count=Count("review_id"))
    distribution_map = {row["review_score"]: row["count"] for row in distribution_raw}
    score_distribution = []
    for score in range(1, 6):
        count = distribution_map.get(score, 0)
        percentage = (count / total * 100) if total else 0
        score_distribution.append({"score": score, "count": count, "percentage": percentage})

    category_english = Subquery(
        CategoryTranslation.objects.filter(
            product_category_name=OuterRef("product__product_category_name")
        ).values("product_category_name_english")[:1]
    )
    category_qs = (
        selectors.filtered_orderitem_queryset(filters)
        .filter(order__orderreview__review_score__isnull=False)
        .values("product__product_category_name")
        .annotate(
            avg_score=Avg("order__orderreview__review_score"),
            category_english=category_english,
        )
    )

    def _category_payload(rows):
        payload = []
        for row in rows:
            category = row["product__product_category_name"] or "unknown"
            payload.append(
                {
                    "category": category,
                    "category_english": row["category_english"] or category,
                    "avg_score": float(row["avg_score"] or 0),
                }
            )
        return payload

    worst = _category_payload(category_qs.order_by("avg_score")[:limit])
    best = _category_payload(category_qs.order_by("-avg_score")[:limit])

    return {
        "avgScore": float(avg_score or 0),
        "scoreDistribution": score_distribution,
        "topWorstCategories": worst,
        "topBestCategories": best,
    }
