from django.urls import path

from .views import EmailTokenObtainPairView, RefreshTokenView, RegisterView

urlpatterns = [
    path("token/", EmailTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", RefreshTokenView.as_view(), name="token_refresh"),
    path("register/", RegisterView.as_view(), name="register"),
]
