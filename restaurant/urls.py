# restaurant/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RestaurantViewSet,
    MenuItemViewSet,
    OrderViewSet,
    OrderItemViewSet
)

router = DefaultRouter()
router.register(r'restaurants', RestaurantViewSet)
router.register(r'menu-items',  MenuItemViewSet)
router.register(r'orders',      OrderViewSet)
router.register(r'order-items', OrderItemViewSet)

urlpatterns = [
    # All endpoints will be under /api/
    path('api/', include(router.urls)),
]
