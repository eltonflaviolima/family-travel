from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CityViewSet, AttractionViewSet, AttractionTipViewSet, api_root

router = DefaultRouter()
router.register(r'cities', CityViewSet, basename='city')
router.register(r'attractions', AttractionViewSet, basename='attraction')
router.register(r'tips', AttractionTipViewSet, basename='tip')

urlpatterns = [
    path('', api_root, name='itinerary-root'),
    path('', include(router.urls)),
]
