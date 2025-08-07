from django.db import models
from django.core.exceptions import ValidationError

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(default="",max_length=100)
    item_code = models.CharField(max_length=30, unique=True)
    quantity = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    last_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}, code:({self.item_code})"
    
    
class StockMovement(models.Model):
    MOVEMENT_CHOICES = [
        ('IN', 'Inbound'),
        ('OUT', 'Outbound'),
    ]

    item_code = models.CharField(max_length=30)
    quantity = models.PositiveIntegerField()
    movement_type = models.CharField(max_length=3, choices=MOVEMENT_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.movement_type} - {self.item_code} ({self.quantity})"

    def clean(self):
        #validation for OUT movement
        if self.movement_type == 'OUT':
            try:
                product = Product.objects.get(item_code=self.item_code)
                if self.quantity > product.quantity:
                    raise ValidationError("Not enough stock to perform this movement.")
            except Product.DoesNotExist:
                raise ValidationError("Product does not exist.")

    def save(self, *args, **kwargs):
        from django.db import transaction

        with transaction.atomic():
            try:
                product = Product.objects.get(item_code=self.item_code)
            except Product.DoesNotExist:
                raise ValidationError("Product with this code does not exist.")

            # Update product quantity
            if self.movement_type == 'IN':
                product.quantity += self.quantity
            elif self.movement_type == 'OUT':
                if product.quantity < self.quantity:
                    raise ValidationError("Not enough stock to perform this movement.")
                product.quantity -= self.quantity

            product.save()
            super().save(*args, **kwargs)