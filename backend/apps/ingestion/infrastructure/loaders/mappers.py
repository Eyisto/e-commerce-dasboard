from decimal import Decimal

from .olist_csv_reader import parse_datetime, parse_decimal, parse_int


def _norm(value):
    if value is None:
        return None
    value = str(value).strip()
    return value if value != "" else None


def _required(value):
    value = _norm(value)
    return value


def _zero_int(value):
    parsed = parse_int(value)
    return parsed if parsed is not None else 0


def _zero_decimal(value):
    parsed = parse_decimal(value)
    return parsed if parsed is not None else Decimal("0.00")


def map_category_translation(row):
    key = _required(row.get("product_category_name"))
    if not key:
        return None
    return {
        "product_category_name": key,
        "product_category_name_english": _norm(row.get("product_category_name_english")),
    }


def map_product(row):
    product_id = _required(row.get("product_id"))
    if not product_id:
        return None
    return {
        "product_id": product_id,
        "product_category_name": _norm(row.get("product_category_name")),
        "product_name_lenght": parse_int(row.get("product_name_lenght")),
        "product_description_lenght": parse_int(row.get("product_description_lenght")),
        "product_photos_qty": parse_int(row.get("product_photos_qty")),
        "product_weight_g": parse_int(row.get("product_weight_g")),
        "product_length_cm": parse_int(row.get("product_length_cm")),
        "product_height_cm": parse_int(row.get("product_height_cm")),
        "product_width_cm": parse_int(row.get("product_width_cm")),
    }


def map_customer(row):
    customer_id = _required(row.get("customer_id"))
    if not customer_id:
        return None
    return {
        "customer_id": customer_id,
        "customer_unique_id": _required(row.get("customer_unique_id")) or "",
        "customer_zip_code_prefix": _zero_int(row.get("customer_zip_code_prefix")),
        "customer_city": _required(row.get("customer_city")) or "",
        "customer_state": _required(row.get("customer_state")) or "",
    }


def map_seller(row):
    seller_id = _required(row.get("seller_id"))
    if not seller_id:
        return None
    return {
        "seller_id": seller_id,
        "seller_zip_code_prefix": _zero_int(row.get("seller_zip_code_prefix")),
        "seller_city": _required(row.get("seller_city")) or "",
        "seller_state": _required(row.get("seller_state")) or "",
    }


def map_order(row):
    order_id = _required(row.get("order_id"))
    customer_id = _required(row.get("customer_id"))
    if not order_id or not customer_id:
        return None
    return {
        "order_id": order_id,
        "customer_id": customer_id,
        "order_status": _required(row.get("order_status")) or "",
        "order_purchase_timestamp": parse_datetime(row.get("order_purchase_timestamp")),
        "order_approved_at": parse_datetime(row.get("order_approved_at")),
        "order_delivered_carrier_date": parse_datetime(row.get("order_delivered_carrier_date")),
        "order_delivered_customer_date": parse_datetime(row.get("order_delivered_customer_date")),
        "order_estimated_delivery_date": parse_datetime(row.get("order_estimated_delivery_date")),
    }


def map_order_item(row):
    order_id = _required(row.get("order_id"))
    product_id = _required(row.get("product_id"))
    seller_id = _required(row.get("seller_id"))
    if not order_id or not product_id or not seller_id:
        return None
    return {
        "order_id": order_id,
        "order_item_id": _zero_int(row.get("order_item_id")),
        "product_id": product_id,
        "seller_id": seller_id,
        "shipping_limit_date": parse_datetime(row.get("shipping_limit_date")),
        "price": _zero_decimal(row.get("price")),
        "freight_value": _zero_decimal(row.get("freight_value")),
    }


def map_payment(row):
    order_id = _required(row.get("order_id"))
    if not order_id:
        return None
    return {
        "order_id": order_id,
        "payment_sequential": _zero_int(row.get("payment_sequential")),
        "payment_type": _required(row.get("payment_type")) or "",
        "payment_installments": _zero_int(row.get("payment_installments")),
        "payment_value": _zero_decimal(row.get("payment_value")),
    }


def map_order_review(row):
    review_id = _required(row.get("review_id"))
    order_id = _required(row.get("order_id"))
    if not review_id or not order_id:
        return None
    return {
        "review_id": review_id,
        "order_id": order_id,
        "review_score": _zero_int(row.get("review_score")),
        "review_comment_title": _norm(row.get("review_comment_title")),
        "review_comment_message": _norm(row.get("review_comment_message")),
        "review_creation_date": parse_datetime(row.get("review_creation_date")),
        "review_answer_timestamp": parse_datetime(row.get("review_answer_timestamp")),
    }


def map_geolocation(row):
    return {
        "geolocation_zip_code_prefix": _zero_int(row.get("geolocation_zip_code_prefix")),
        "geolocation_lat": _zero_decimal(row.get("geolocation_lat")),
        "geolocation_lng": _zero_decimal(row.get("geolocation_lng")),
        "geolocation_city": _required(row.get("geolocation_city")) or "",
        "geolocation_state": _required(row.get("geolocation_state")) or "",
    }
