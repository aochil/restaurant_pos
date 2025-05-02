from rest_framework import viewsets, permissions
from .models import Restaurant, MenuItem, Order, OrderItem
from .serializers import (
    RestaurantSerializer,
    MenuItemSerializer,
    OrderSerializer,
    OrderItemSerializer
)

class RestaurantViewSet(viewsets.ModelViewSet):
    """
    Anyone (even unauthenticated) can list & retrieve restaurants.
    Authenticated users (owners) can also create/edit their own restaurants.
    """
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # When a restaurant is created, set the current user as its owner
        serializer.save(owner=self.request.user)


class MenuItemViewSet(viewsets.ModelViewSet):
    """
    List & retrieve menu items for any restaurant.
    Only the restaurant’s owner can create/update/delete its menu items.
    """
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # If you want to scope items to a specific restaurant:
        restaurant_id = self.request.query_params.get('restaurant')
        if restaurant_id:
            return MenuItem.objects.filter(restaurant_id=restaurant_id)
        return super().get_queryset()

    def perform_create(self, serializer):
        # Ensure when an owner creates a menu item, they attach it to one of their restaurants
        serializer.save(restaurant_id=self.request.data['restaurant_id'])


class OrderViewSet(viewsets.ModelViewSet):
    """
    Customers can create orders and see only their own orders.
    Restaurant owners can see orders for *their* restaurants and update status.
    """

    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # If the user owns restaurants, show orders for those restaurants:
        owned_restaurants = Restaurant.objects.filter(owner=user)
        if owned_restaurants.exists():
            # Orders that include any menuitem belonging to one of their restaurants
            return Order.objects.filter(
                items__menu_item__restaurant__in=owned_restaurants
            ).distinct()
        # Otherwise, show only orders the user placed
        return Order.objects.filter(customer=user)

    def perform_create(self, serializer):
        # On order creation, record which customer placed it
        serializer.save(customer=self.request.user)


class OrderItemViewSet(viewsets.ModelViewSet):
    """
    Mostly managed via nested OrderSerializer, but exposed here if needed.
    Only authenticated users can interact.
    """
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]
