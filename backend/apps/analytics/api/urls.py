from django.urls import path

from .views import (
    KPIView,
    LogisticsView,
    ReviewsMetricsView,
    SalesByDayView,
    TopCategoriesView,
    TopProductsView,
    TopSellersView,
)

urlpatterns = [
    path("kpis", KPIView.as_view(), name="metrics-kpis"),
    path("sales-by-day", SalesByDayView.as_view(), name="metrics-sales-by-day"),
    path("top-products", TopProductsView.as_view(), name="metrics-top-products"),
    path("top-categories", TopCategoriesView.as_view(), name="metrics-top-categories"),
    path("top-sellers", TopSellersView.as_view(), name="metrics-top-sellers"),
    path("logistics", LogisticsView.as_view(), name="metrics-logistics"),
    path("reviews", ReviewsMetricsView.as_view(), name="metrics-reviews"),
]
