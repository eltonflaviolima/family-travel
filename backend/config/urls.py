# pylint: disable=missing-module-docstring,
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Travel API",
        default_version='v1',
        description="API para gerenciamento de cidades, atrações e dicas de viagem.",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="dev@example.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT Authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # DRF Browsable API authentication (login/logout via interface)
    path('api-auth/', include('rest_framework.urls')),

    # App endpoints (serão criados nos próximos passos)
    path('api/auth/', include('core.authentication.urls')),
    path('api/itinerary/', include('core.itinerary.urls')),
    path('api/checklist/', include('core.checklist.urls')),
    path('api/photos/', include('core.photos.urls')),

     # Swagger UI
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    # JSON/YAML
    path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger.yaml', schema_view.without_ui(cache_timeout=0), name='schema-yaml'),
]

# Servir arquivos de media em desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
