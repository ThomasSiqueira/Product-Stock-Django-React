from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet,StockMovementListCreateView, StockMovementDeleteView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import CustomTokenObtainPairView

router = DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/',  CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('stock/', StockMovementListCreateView.as_view(), name='stock-movement-create'),
    path('stock/<int:pk>/', StockMovementDeleteView.as_view(), name='stock-delete'),
]