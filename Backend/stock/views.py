from django.shortcuts import render

from rest_framework import generics
from rest_framework import viewsets, filters
from .models import Product
from rest_framework.permissions import IsAuthenticated
from .serializers import ProductSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from .models import StockMovement
from .serializers import StockMovementSerializer
from django.db.models import Q
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.response import Response
from rest_framework import status

class StockMovementListCreateView(generics.ListCreateAPIView):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()

        item_code = self.request.query_params.get('item_code')
            
        if item_code:
            queryset = queryset.filter(item_code__icontains=item_code)

        return queryset
    
class StockMovementDeleteView(generics.RetrieveDestroyAPIView):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated]
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except DjangoValidationError as e:
            raise DRFValidationError(str(e))


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-last_update')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        if self.action == 'list':
            name = self.request.query_params.get('name')
            item_code = self.request.query_params.get('item_code')
            category = self.request.query_params.get('category')

            if name:
                queryset = queryset.filter(name__icontains=name)
            elif item_code:
                queryset = queryset.filter(item_code__icontains=item_code)
            elif category:
                queryset = queryset.filter(category__icontains=category)

        return queryset

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
