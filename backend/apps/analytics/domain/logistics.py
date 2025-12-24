from datetime import timedelta

from django.db.models import Avg, Case, Count, DurationField, ExpressionWrapper, F, Q, Value, When
from django.db.models.functions import TruncDate

from apps.analytics.infrastructure import selectors


def get_logistics(filters):
    orders = selectors.filtered_order_queryset(filters)
    base = orders.filter(
        order_delivered_customer_date__isnull=False,
        order_estimated_delivery_date__isnull=False,
    )
    total = base.count()
    late = base.filter(order_delivered_customer_date__gt=F("order_estimated_delivery_date")).count()
    on_time = total - late
    late_rate = (late / total * 100) if total else 0
    on_time_rate = 100 - late_rate if total else 0

    lead_base = orders.filter(
        order_delivered_customer_date__isnull=False,
        order_purchase_timestamp__isnull=False,
    )
    duration = ExpressionWrapper(
        F("order_delivered_customer_date") - F("order_purchase_timestamp"),
        output_field=DurationField(),
    )
    avg_duration = lead_base.aggregate(avg=Avg(duration))["avg"]
    avg_lead_time_days = (avg_duration.total_seconds() / 86400) if avg_duration else 0

    delay_duration = Case(
        When(
            order_delivered_customer_date__gt=F("order_estimated_delivery_date"),
            then=ExpressionWrapper(
                F("order_delivered_customer_date") - F("order_estimated_delivery_date"),
                output_field=DurationField(),
            ),
        ),
        default=Value(timedelta(0), output_field=DurationField()),
        output_field=DurationField(),
    )
    avg_delay_duration = base.aggregate(avg=Avg(delay_duration))["avg"]
    avg_delay_days = (avg_delay_duration.total_seconds() / 86400) if avg_delay_duration else 0

    by_day = (
        base.annotate(date=TruncDate("order_delivered_customer_date"))
        .values("date")
        .annotate(
            total=Count("order_id", distinct=True),
            late=Count(
                "order_id",
                filter=Q(order_delivered_customer_date__gt=F("order_estimated_delivery_date")),
                distinct=True,
            ),
        )
        .order_by("date")
    )
    delivery_by_day = []
    for row in by_day:
        day_total = row["total"] or 0
        day_late = row["late"] or 0
        delivery_by_day.append(
            {
                "date": row["date"].isoformat() if row["date"] else None,
                "lateRate": (day_late / day_total * 100) if day_total else 0,
                "onTimeRate": (100 - (day_late / day_total * 100)) if day_total else 0,
            }
        )

    by_state = (
        base.values("customer__customer_state")
        .annotate(
            avg_lead=Avg(duration),
            avg_delay=Avg(delay_duration),
        )
        .order_by("customer__customer_state")
    )
    delivery_by_state = []
    for row in by_state:
        avg_lead = row["avg_lead"]
        avg_delay = row["avg_delay"]
        delivery_by_state.append(
            {
                "state": row["customer__customer_state"],
                "avgLeadTime": (avg_lead.total_seconds() / 86400) if avg_lead else 0,
                "avgDelay": (avg_delay.total_seconds() / 86400) if avg_delay else 0,
            }
        )

    return {
        "lateDeliveryRate": late_rate,
        "onTimeDeliveryRate": on_time_rate,
        "avgLeadTimeDays": avg_lead_time_days,
        "avgDelayDays": avg_delay_days,
        "lateOrdersCount": late,
        "onTimeOrdersCount": on_time,
        "deliveryByDay": delivery_by_day,
        "deliveryByState": delivery_by_state,
    }
