from datetime import datetime

from django.db.models import Count, Sum
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from apps.sales.api.serializers import OrderSerializer
from apps.analytics.infrastructure import selectors


class OrderPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 200


class OrderListView(ListAPIView):
    serializer_class = OrderSerializer
    pagination_class = OrderPagination

    def get_queryset(self):
        filters = self._filters_from_request()
        qs = selectors.filtered_order_queryset(filters)
        return (
            qs.annotate(
                items_count=Count("orderitem"),
                gmv=Sum("orderitem__price"),
            )
            .order_by("order_purchase_timestamp")
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return Response(
                {
                    "data": serializer.data,
                    "total": self.paginator.page.paginator.count,
                }
            )
        serializer = self.get_serializer(queryset, many=True)
        return Response({"data": serializer.data, "total": len(serializer.data)})

    def _filters_from_request(self):
        return {
            "from": self._parse_date(self.request.query_params.get("from")),
            "to": self._parse_date(self.request.query_params.get("to")),
            "status": self.request.query_params.get("status"),
            "state": self.request.query_params.get("state"),
        }

    def _parse_date(self, value):
        if not value:
            return None
        try:
            return datetime.strptime(value, "%Y-%m-%d").date()
        except ValueError:
            return None
