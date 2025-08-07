from django.test import TestCase
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from django.core.exceptions import ValidationError
from .models import Product, StockMovement
from decimal import Decimal
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class ProductAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        response = self.client.post('/api/auth/', {
            'username': 'testuser',
            'password': 'testpass'
        }, format='json')
        
        self.assertEqual(response.status_code, 200, msg="JWT login failed in test setup")
        self.access_token = response.data['access']
        
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)


        self.product_data = {
            'name': 'Test Data',
            'description': 'data used for testing',
            'category': "category test",
            'item_code': '000TEST1',
            'quantity': 5,
            'price': 100.00,
        }
        self.product = Product.objects.create(**self.product_data)


    def test_create_product(self):
        
        new_product = {
            'name': 'Test Data 2',
            'description': 'data used for the second test',
            'category': "category test",
            'item_code': '000TEST2',
            'quantity': 2,
            'price': 120.1,
        }
        response = self.client.post('/api/products/', new_product, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 2)
        product_test = Product.objects.get(item_code='000TEST2')
        self.assertEqual(product_test.description, 'data used for the second test')
        self.assertEqual(product_test.category, 'category test')
        self.assertEqual(product_test.quantity, 2)
        self.assertEqual(product_test.price, Decimal('120.1'))

    def test_get_product_list(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_update_product(self):
        update_data = {'quantity': 200}
        response = self.client.patch(f'/api/products/{self.product.id}/', update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 200)

    def test_delete_product(self):
        response = self.client.delete(f'/api/products/{self.product.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Product.objects.count(), 0)



class StockMovementTests(APITestCase):
    def setUp(self):
        self.product = Product.objects.create(
            name="Test Product",
            description="Just a test",
            category="Test Category",
            item_code="ITEM001",
            quantity=100,
            price=9.99
        )

    def test_inbound_movement_quantity(self):
        movement = StockMovement(
            item_code="ITEM001",
            quantity=50,
            movement_type="IN",
            note="Restocking"
        )
        movement.save()

        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 150)

    def test_outbound_movement_quantity(self):
        movement = StockMovement(
            item_code="ITEM001",
            quantity=30,
            movement_type="OUT",
            note="Sold items"
        )
        movement.save()

        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 70)

    def test_outbound_movement_fails_with_insufficient_stock(self):
        movement = StockMovement(
            item_code="ITEM001",
            quantity=200,
            movement_type="OUT",
            note="Too many"
        )

        with self.assertRaises(ValidationError) as context:
            movement.save()

        self.assertIn("Not enough stock", str(context.exception))

    def test_movement_fails_if_product_does_not_exist(self):
        movement = StockMovement(
            item_code="NONEXISTENT",
            quantity=10,
            movement_type="IN",
            note="Invalid product"
        )

        with self.assertRaises(ValidationError) as context:
            movement.save()

        self.assertIn("Product with this code does not exist", str(context.exception))