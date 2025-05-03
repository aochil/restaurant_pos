# restaurant/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RestaurantViewSet,
    MenuItemViewSet,
    OrderViewSet,
    OrderItemViewSet,
    RegisterView, 
    LoginView
)

router = DefaultRouter()
router.register(r'restaurants', RestaurantViewSet)
router.register(r'menu-items',  MenuItemViewSet)
router.register(r'orders',      OrderViewSet)
router.register(r'order-items', OrderItemViewSet)

urlpatterns = [
    # All endpoints will be under /api/
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/',    LoginView.as_view(),    name='login'),
    path('api/', include(router.urls)),
]
