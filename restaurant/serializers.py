from rest_framework import serializers
from .models import Restaurant, MenuItem, Order, OrderItem

class MenuItemSerializer(serializers.ModelSerializer):
    # Now includes 'restaurant' so API consumers know which restaurant each item belongs to
    class Meta:
        model  = MenuItem
        fields = ['id', 'restaurant', 'name', 'price', 'description']

class RestaurantSerializer(serializers.ModelSerializer):
    # Nest menu items under the restaurant for a single GET
    menu_items = MenuItemSerializer(many=True, read_only=True)
    # Show the owner's username
    owner      = serializers.StringRelatedField(read_only=True)

    class Meta:
        model  = Restaurant
        fields = ['id', 'name', 'owner', 'menu_items']

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item    = MenuItemSerializer(read_only=True)
    menu_item_id = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.all(),
        source='menu_item',
        write_only=True
    )

    class Meta:
        model  = OrderItem
        fields = ['id', 'menu_item', 'menu_item_id', 'quantity', 'total_price']

class OrderSerializer(serializers.ModelSerializer):
    items    = OrderItemSerializer(many=True)
    customer = serializers.StringRelatedField(read_only=True)

    class Meta:
        model  = Order
        fields = ['id', 'customer', 'status', 'total_amount', 'created_at', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        total = 0
        for item_data in items_data:
            oi = OrderItem.objects.create(order=order, **item_data)
            total += oi.total_price
        order.total_amount = total
        order.save()
        return order
