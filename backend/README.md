# Backend Olist Analytics (Django + DRF)

Backend en Django + Django REST Framework para cargar el dataset Olist (Kaggle brazilian-ecommerce) en SQLite y exponer APIs REST.

## Instalacion

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Migraciones

```bash
python manage.py migrate
```

## Datos (CSV)

Crea la carpeta `./data/olist` con estos archivos (nombres exactos):

- olist_orders_dataset.csv
- olist_order_items_dataset.csv
- olist_order_payments_dataset.csv
- olist_order_reviews_dataset.csv
- olist_products_dataset.csv
- olist_customers_dataset.csv
- olist_sellers_dataset.csv
- olist_geolocation_dataset.csv
- product_category_name_translation.csv

Ejemplo de estructura:

```
backend/
  data/
    olist/
      olist_orders_dataset.csv
      ...
```

## Importacion

```bash
python manage.py import_olist --data-dir ./data/olist
```

Opciones:

```bash
python manage.py import_olist --data-dir ./data/olist --truncate
python manage.py import_olist --data-dir ./data/olist --limit 1000
```

## Servidor

```bash
python manage.py runserver
```

## Ejemplos de API

```bash
curl "http://127.0.0.1:8000/api/v1/catalog/products/"
curl "http://127.0.0.1:8000/api/v1/orders/?page=1&page_size=20"
curl "http://127.0.0.1:8000/api/v1/reviews/"
```

Metricas:

```bash
curl "http://127.0.0.1:8000/api/v1/metrics/kpis?from=2017-01-01&to=2017-12-31"
curl "http://127.0.0.1:8000/api/v1/metrics/sales-by-day?from=2017-01-01&to=2017-01-31"
curl "http://127.0.0.1:8000/api/v1/metrics/top-products?limit=10"
curl "http://127.0.0.1:8000/api/v1/metrics/top-categories?limit=10"
curl "http://127.0.0.1:8000/api/v1/metrics/top-sellers?limit=10"
curl "http://127.0.0.1:8000/api/v1/metrics/logistics"
curl "http://127.0.0.1:8000/api/v1/metrics/reviews"
```
