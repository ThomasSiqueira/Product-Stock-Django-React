from rest_framework import serializers
from .models import Product
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import StockMovement
from django.core.exceptions import ValidationError as DjangoValidationError

class StockMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMovement
        fields = '__all__' 
        
    def create(self, validated_data):
        try:
            instance = StockMovement(**validated_data)
            instance.clean()  # explicitly call model validation
            instance.save()
            return instance
        except DjangoValidationError as e:
            print(e)
            if hasattr(e, "message_dict"):
                raise serializers.ValidationError(e.message_dict)
            elif hasattr(e, "messages"):
                raise serializers.ValidationError({"non_field_errors": e.messages})
            else:
                raise serializers.ValidationError({"non_field_errors": [str(e)]})

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
           
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        return data