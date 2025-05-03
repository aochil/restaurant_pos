from rest_framework import permissions
from .models import Restaurant

class IsRestaurantOwner(permissions.BasePermission):
    """
    - Safe methods (GET, HEAD, OPTIONS) are allowed for everyone.
    - Unsafe methods (POST, PUT, PATCH, DELETE) require:
        * On collections (POST), the user must have role 'restaurant_owner'.
        * On individual objects, the user must be the restaurant.owner.
    """

    def has_permission(self, request, view):
        # Always allow read-only:
        if request.method in permissions.SAFE_METHODS:
            return True
        # For POST (creating a new restaurant), ensure they’re an owner:
        return getattr(request.user, 'profile', None) and \
               request.user.profile.role == 'restaurant_owner'

    def has_object_permission(self, request, view, obj):
        # Safe reads always allowed
        if request.method in permissions.SAFE_METHODS:
            return True
        # Writes on an existing restaurant require that they actually own it
        return obj.owner == request.user


class IsOrderOwnerOrRestaurantOwner(permissions.BasePermission):
    """
    - Customers can view their own Order (SAFE_METHODS).
    - Restaurant owners can view/update Orders for their restaurants.
    """

    def has_object_permission(self, request, view, order):
        # SAFE (read) methods:
        if request.method in permissions.SAFE_METHODS:
            # Customer may view their own
            if order.customer == request.user:
                return True
            # Owner may view orders for their restaurants
            return Restaurant.objects.filter(
                owner=request.user,
                menu_items__orderitem__order=order
            ).exists()

        # Write (PATCH/PUT): only restaurant owner for that order
        return Restaurant.objects.filter(
            owner=request.user,
            menu_items__orderitem__order=order
        ).exists()
