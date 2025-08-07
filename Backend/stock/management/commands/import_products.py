import csv
import os
from django.core.management.base import BaseCommand
from stock.models import Product 

class Command(BaseCommand):
    help = 'Import products from CSV'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **kwargs):
        csv_file = kwargs['csv_file']

        if not os.path.isfile(csv_file):
            self.stderr.write(f"File not found: {csv_file}")
            return

        with open(csv_file, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                product, created = Product.objects.get_or_create(
                    item_code=row['item_code'],
                    defaults={
                        'name': row['name'],
                        'price': row['price'],
                        'quantity': row['quantity'],
                        'category': row['category'],
                        'description': row['description'],
                    }
                )
                if created:
                    self.stdout.write(f"Imported: {product.name}")
                else:
                    self.stdout.write(f"Skipped (already exists): {product.name}")
