from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CityViewSet, AttractionViewSet, AttractionTipViewSet

router = DefaultRouter()
router.register(r'cities', CityViewSet, basename='city')
router.register(r'attractions', AttractionViewSet, basename='attraction')
router.register(r'tips', AttractionTipViewSet, basename='tip')

urlpatterns = [
    path('', include(router.urls)),
]
