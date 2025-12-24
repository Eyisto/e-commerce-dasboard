from datetime import datetime

from django.db.models import Count, Sum
from django.db.models.functions import TruncDate
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.analytics.domain import kpis, logistics, rankings
from apps.analytics.infrastructure import selectors


def _parse_date(value):
    if not value:
        return None
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError:
        return None


def _filters_from_request(request):
    return {
        "from": _parse_date(request.query_params.get("from")),
        "to": _parse_date(request.query_params.get("to")),
        "status": request.query_params.get("status"),
        "state": request.query_params.get("state"),
        "category": request.query_params.get("category"),
        "seller_id": request.query_params.get("seller_id"),
    }


def _decimal_to_float(value):
    return float(value) if value is not None else 0


class KPIView(APIView):
    def get(self, request):
        filters = _filters_from_request(request)
        data = kpis.get_kpis(filters)
        reviews_data = kpis.get_reviews_kpis(filters)
        logistics_data = logistics.get_logistics(filters)
        response = {
            "gmv": _decimal_to_float(data["gmv"]),
            "orders_count": data["orders_count"],
            "items_sold": data["items_sold"],
            "aov": _decimal_to_float(data["aov"]),
            "paid_total": _decimal_to_float(data["paid_total"]),
            "avg_review_score": reviews_data["avg_review_score"],
            "late_delivery_rate": logistics_data["lateDeliveryRate"],
        }
        return Response(response)


class SalesByDayView(APIView):
    def get(self, request):
        filters = _filters_from_request(request)
        qs = selectors.filtered_orderitem_queryset(filters)
        qs = qs.filter(order__order_purchase_timestamp__isnull=False)
        data = (
            qs.annotate(date=TruncDate("order__order_purchase_timestamp"))
            .values("date")
            .annotate(gmv=Sum("price"), orders_count=Count("order", distinct=True))
            .order_by("date")
        )
        series = [
            {
                "date": item["date"].isoformat() if item["date"] else None,
                "gmv": _decimal_to_float(item["gmv"]),
                "orders_count": item["orders_count"],
            }
            for item in data
        ]
        return Response(series)


class TopProductsView(APIView):
    def get(self, request):
        filters = _filters_from_request(request)
        limit = int(request.query_params.get("limit", 10))
        data = rankings.top_products(filters, limit=limit)
        response = [
            {
                "product_id": item["product_id"],
                "product_name": item["product_name"],
                "category": item["category"],
                "category_english": item["category_english"],
                "total_sold": item["total_sold"],
                "gmv": _decimal_to_float(item["gmv"]),
            }
            for item in data
        ]
        return Response(response)


class TopCategoriesView(APIView):
    def get(self, request):
        filters = _filters_from_request(request)
        limit = int(request.query_params.get("limit", 10))
        data = rankings.top_categories(filters, limit=limit)
        response = [
            {
                "category": item["category"],
                "category_english": item["category_english"],
                "total_sold": item["total_sold"],
                "gmv": _decimal_to_float(item["gmv"]),
            }
            for item in data
        ]
        return Response(response)


class TopSellersView(APIView):
    def get(self, request):
        filters = _filters_from_request(request)
        limit = int(request.query_params.get("limit", 10))
        data = rankings.top_sellers(filters, limit=limit)
        response = [
            {
                "seller_id": item["seller_id"],
                "seller_city": item["seller_city"],
                "seller_state": item["seller_state"],
                "orders_count": item["orders_count"],
                "gmv": _decimal_to_float(item["gmv"]),
                "avg_review_score": item["avg_review_score"] or 0,
                "late_delivery_rate": item["late_delivery_rate"],
            }
            for item in data
        ]
        return Response(response)


class LogisticsView(APIView):
    def get(self, request):
        filters = _filters_from_request(request)
        data = logistics.get_logistics(filters)
        return Response(data)


class ReviewsMetricsView(APIView):
    def get(self, request):
        filters = _filters_from_request(request)
        data = kpis.get_reviews_metrics(filters)
        return Response(data)
