from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/catalog/", include("apps.catalog.api.urls")),
    path("api/v1/", include("apps.sales.api.urls")),
    path("api/v1/", include("apps.reviews.api.urls")),
    path("api/v1/", include("apps.geo.api.urls")),
    path("api/v1/metrics/", include("apps.analytics.api.urls")),
]
