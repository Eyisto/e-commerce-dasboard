import csv
from datetime import datetime
from decimal import Decimal

from django.utils import timezone


def parse_int(value):
    if value is None:
        return None
    value = str(value).strip()
    if value == "":
        return None
    try:
        return int(value)
    except ValueError:
        return None


def parse_decimal(value):
    if value is None:
        return None
    value = str(value).strip()
    if value == "":
        return None
    try:
        return Decimal(value)
    except Exception:
        return None


def parse_datetime(value):
    if value is None:
        return None
    value = str(value).strip()
    if value == "":
        return None
    try:
        parsed = datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
        return timezone.make_aware(parsed) if timezone.is_naive(parsed) else parsed
    except ValueError:
        return None


def read_csv(file_path, limit=None):
    with open(file_path, "r", encoding="utf-8", errors="replace", newline="") as csvfile:
        reader = csv.DictReader(csvfile)
        for idx, row in enumerate(reader, start=1):
            yield row
            if limit and idx >= limit:
                break
