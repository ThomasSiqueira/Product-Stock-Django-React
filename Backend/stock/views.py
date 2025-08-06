from django.shortcuts import render

from rest_framework import viewsets
from .models import Product
from rest_framework.permissions import IsAuthenticated
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-last_update')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]