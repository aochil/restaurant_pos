from django.db import models
from django.contrib.auth.models import User

class Restaurant(models.Model):
    name  = models.CharField(max_length=255)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='restaurants'
    )

    def __str__(self):
        return self.name

# Model for Menu Item
class MenuItem(models.Model):
    restaurant  = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name='menu_items',
        null=True,
        blank=True
    )
    name        = models.CharField(max_length=255)
    price       = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.TextField()

    def __str__(self):
        return f"{self.name} @ {self.restaurant.name}"

# Model for Order
class Order(models.Model):
    STATUS_CHOICES = [
        ('P', 'Pending'),  # Order is pending
        ('I', 'In Progress'),  # Order is in progress
        ('C', 'Completed'),  # Order is completed
    ]
    customer = models.ForeignKey(User, on_delete=models.CASCADE)  # Customer placing the order
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='P')  # Status of the order
    total_amount = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)  # Total amount for the order
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for when the order was created

    def __str__(self):
        return f"Order {self.id} - {self.customer.username}"

# Model for Order Item (to link MenuItems to Orders)
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)  # Link to the parent order
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)  # Link to the menu item
    quantity = models.PositiveIntegerField(default=1)  # Quantity of the menu item
    total_price = models.DecimalField(max_digits=6, decimal_places=2)  # Total price for this specific item in the order

    def save(self, *args, **kwargs):
        # Calculate the total price for the order item (quantity * menu item price)
        self.total_price = self.menu_item.price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} x {self.menu_item.name} (Order {self.order.id})"
