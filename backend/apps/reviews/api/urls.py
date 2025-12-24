from django.urls import path

from .views import OrderReviewListView

urlpatterns = [
    path("reviews/", OrderReviewListView.as_view(), name="reviews-list"),
]
