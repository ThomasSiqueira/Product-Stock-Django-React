from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Product
from decimal import Decimal

class ProductAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
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
