# Olist Analytics Dashboard

Dashboard full-stack para explorar el dataset de Olist (Brasil). Incluye:
- Backend Django + DRF con endpoints de KPIs, rankings, pedidos, logística y reviews.
- Frontend React + Vite con UI analítica.

## Estructura
- `backend/`: API y carga de datos.
- `frontend/`: UI del dashboard.

## Requisitos
- Python 3.11+ (recomendado)
- Node.js 18+

## Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py import_olist --data-dir ./data/olist
python manage.py runserver
```

## Frontend
```bash
cd frontend
npm install
npm run dev
```

Config por defecto en `frontend/.env`:
- `VITE_USE_MOCK=true` para mock.
- `VITE_DATA_MIN_DATE` y `VITE_DATA_MAX_DATE` para el datepicker.

Para usar el backend real:
```bash
VITE_USE_MOCK=false npm run dev
```

## Dataset
Los CSV de Olist deben estar en `backend/data/olist/`. Estos archivos no se versionan en Git.

## Endpoints de ejemplo
```bash
curl "http://127.0.0.1:8000/api/v1/metrics/kpis?from=2017-01-01&to=2017-12-31"
curl "http://127.0.0.1:8000/api/v1/metrics/sales-by-day?from=2017-01-01&to=2017-01-31"
curl "http://127.0.0.1:8000/api/v1/metrics/top-products?limit=5"
curl "http://127.0.0.1:8000/api/v1/metrics/logistics?from=2017-01-01&to=2017-12-31"
curl "http://127.0.0.1:8000/api/v1/metrics/reviews?from=2017-01-01&to=2017-12-31"
curl "http://127.0.0.1:8000/api/v1/orders?page=1&page_size=5"
```
