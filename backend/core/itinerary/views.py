from datetime import datetime
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q

from .models import City, Attraction, AttractionTip
from .serializers import (
    CitySerializer,
    CityListSerializer,
    CityCreateSerializer,
    AttractionSerializer,
    AttractionListSerializer,
    AttractionTipSerializer,
)


class CityViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de cidades turísticas.

    list: Retorna lista de cidades com contagem de atrações
    retrieve: Retorna detalhes completos da cidade com atrações
    create: Cria nova cidade
    update/partial_update: Atualiza cidade existente
    destroy: Remove cidade

    Actions customizadas:
    - upcoming: Cidades com chegada futura
    - current: Cidades onde estou agora
    - past: Cidades já visitadas
    - by_country: Agrupa cidades por país
    """
    queryset = City.objects.all()
    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['country']
    search_fields = ['name', 'country', 'description']
    ordering_fields = ['name', 'country', 'arrival_date', 'departure_date']
    ordering = ['arrival_date']

    def get_serializer_class(self):
        """
        Retorna serializer apropriado baseado na action.
        """
        if self.action == 'list':
            return CityListSerializer
        elif self.action == 'create':
            return CityCreateSerializer
        return CitySerializer

    def get_queryset(self):
        """
        Otimiza queries com prefetch_related.
        """
        queryset = super().get_queryset()

        if self.action == 'retrieve':
            queryset = queryset.prefetch_related(
                'attractions',
                'attractions__tips'
            )
        elif self.action == 'list':
            queryset = queryset.annotate(
                attractions_count=Count('attractions')
            )

        return queryset

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """
        Retorna cidades com data de chegada futura.
        """
        now = datetime.now()
        cities = self.queryset.filter(
            arrival_date__gt=now).order_by('arrival_date')
        serializer = CityListSerializer(cities, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def current(self, request):
        """
        Retorna cidades onde estou visitando agora.
        """
        now = datetime.now()
        cities = self.queryset.filter(
            arrival_date__lte=now,
            departure_date__gte=now
        )
        serializer = CityListSerializer(cities, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def past(self, request):
        """
        Retorna cidades já visitadas.
        """
        now = datetime.now()
        cities = self.queryset.filter(
            departure_date__lt=now
        ).order_by('-departure_date')
        serializer = CityListSerializer(cities, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_country(self, request):
        """
        Agrupa cidades por país com estatísticas.
        """
        countries = self.queryset.values('country').annotate(
            cities_count=Count('id'),
            attractions_count=Count('attractions')
        ).order_by('country')

        return Response(countries)

    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """
        Retorna estatísticas detalhadas de uma cidade.
        """
        city = self.get_object()

        attractions_by_type = city.attractions.values('type').annotate(
            count=Count('id')
        )

        stats = {
            'city': city.name,
            'country': city.country,
            'total_attractions': city.attractions.count(),
            'total_tips': AttractionTip.objects.filter(
                attraction__city=city
            ).count(),
            'attractions_by_type': list(attractions_by_type),
            'duration_days': (city.departure_date - city.arrival_date).days if city.arrival_date and city.departure_date else None,
        }

        return Response(stats)


class AttractionViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de atrações turísticas.

    list: Retorna lista de atrações
    retrieve: Retorna detalhes completos da atração com dicas
    create: Cria nova atração
    update/partial_update: Atualiza atração existente
    destroy: Remove atração

    Actions customizadas:
    - by_type: Filtra atrações por tipo
    - by_city: Filtra atrações por cidade
    - popular: Atrações com mais dicas
    """
    queryset = Attraction.objects.all()
    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['city', 'type']
    search_fields = ['name', 'description', 'fun_fact']
    ordering_fields = ['name', 'type', 'city__name']
    ordering = ['name']

    def get_serializer_class(self):
        """
        Retorna serializer apropriado baseado na action.
        """
        if self.action == 'list':
            return AttractionListSerializer
        return AttractionSerializer

    def get_queryset(self):
        """
        Otimiza queries com select_related e prefetch_related.
        """
        queryset = super().get_queryset()

        if self.action == 'retrieve':
            queryset = queryset.select_related('city').prefetch_related('tips')
        elif self.action == 'list':
            queryset = queryset.select_related('city').annotate(
                tips_count=Count('tips')
            )

        return queryset

    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """
        Retorna atrações agrupadas por tipo.
        """
        attraction_type = request.query_params.get('type', None)

        if not attraction_type:
            return Response(
                {'error': 'Parâmetro "type" é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )

        attractions = self.queryset.filter(type=attraction_type)
        serializer = AttractionListSerializer(attractions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def popular(self, request):
        """
        Retorna atrações com mais dicas (mais populares).
        """
        limit = int(request.query_params.get('limit', 10))

        attractions = self.queryset.annotate(
            tips_count=Count('tips')
        ).filter(tips_count__gt=0).order_by('-tips_count')[:limit]

        serializer = AttractionListSerializer(attractions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_tip(self, request, pk=None):
        """
        Adiciona uma dica a uma atração específica.
        """
        attraction = self.get_object()

        data = request.data.copy()
        data['attraction'] = attraction.id

        serializer = AttractionTipSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AttractionTipViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de dicas de atrações.

    list: Retorna lista de dicas
    retrieve: Retorna detalhes de uma dica
    create: Cria nova dica
    update/partial_update: Atualiza dica existente
    destroy: Remove dica

    Actions customizadas:
    - by_category: Filtra dicas por categoria
    - by_attraction: Filtra dicas por atração
    """
    queryset = AttractionTip.objects.all()
    serializer_class = AttractionTipSerializer
    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['attraction', 'category']
    search_fields = ['title']
    ordering_fields = ['title', 'category']
    ordering = ['category', 'title']

    def get_queryset(self):
        """
        Otimiza queries com select_related.
        """
        return super().get_queryset().select_related('attraction', 'attraction__city')

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """
        Retorna dicas agrupadas por categoria.
        """
        category = request.query_params.get('category', None)

        if not category:
            return Response(
                {'error': 'Parâmetro "category" é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )

        tips = self.queryset.filter(category=category)
        serializer = self.get_serializer(tips, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Retorna estatísticas sobre as dicas.
        """
        stats = {
            'total_tips': self.queryset.count(),
            'by_category': list(
                self.queryset.values('category').annotate(
                    count=Count('id')
                )
            ),
            'attractions_with_tips': self.queryset.values('attraction').distinct().count(),
        }

        return Response(stats)
