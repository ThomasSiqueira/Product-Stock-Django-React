import csv
import os
from django.core.management.base import BaseCommand
from stock.models import StockMovement

class Command(BaseCommand):
    help = 'Import stock movements from CSV'

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
                try:
                    movement = StockMovement.objects.create(
                        item_code=row['item_code'],
                        quantity = int(row['quantity']),
                        movement_type = row['movement_type'],
                        note = row['note'],
                    
                        )
                    self.stdout.write(f"Imported: {movement.item_code} (Qty: {movement.quantity}, Type: {movement.movement_type})")
                except Exception as e:
                    self.stdout.write(f"Error importing {row['item_code']}: {str(e)}")