from rest_framework import serializers
from .models import Restaurant, MenuItem, Order, OrderItem, UserProfile
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

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
    total_price = serializers.DecimalField(
        max_digits=6,
        decimal_places=2,
        read_only=True,
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

class RegistrationSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=UserProfile.ROLE_CHOICES, write_only=True)
    password = serializers.CharField(write_only=True)

    profile_role = serializers.CharField(source='profile.role', read_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'role', 'profile_role']

    def create(self, validated_data):
        # Pull out and remove the role & password from the incoming data
        role = validated_data.pop('role')
        password = validated_data.pop('password')

        # Create the user
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        # Create the profile with chosen role
        UserProfile.objects.create(user=user, role=role)

        # Create an auth token for the new user
        Token.objects.create(user=user)

        return user