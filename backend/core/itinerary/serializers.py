from rest_framework import serializers
from .models import City, Attraction, AttractionTip


class AttractionTipSerializer(serializers.ModelSerializer):
    """
    Serializer para dicas de atrações.
    """
    category_display = serializers.CharField(
        source='get_category_display',
        read_only=True
    )

    class Meta:
        model = AttractionTip
        fields = [
            'id',
            'attraction',
            'title',
            'category',
            'category_display',
        ]
        read_only_fields = ['id']

    def validate(self, attrs):
        """
        Valida que a combinação title + attraction seja única.
        """
        title = attrs.get('title')
        attraction = attrs.get('attraction')

        # No caso de update, excluir a instância atual da validação
        instance_id = self.instance.id if self.instance else None

        if AttractionTip.objects.filter(
            title=title,
            attraction=attraction
        ).exclude(id=instance_id).exists():
            raise serializers.ValidationError(
                "Já existe uma dica com este título para esta atração."
            )

        return attrs


class AttractionSerializer(serializers.ModelSerializer):
    """
    Serializer para atrações turísticas.
    """
    type_display = serializers.CharField(
        source='get_type_display',
        read_only=True
    )
    city_name = serializers.CharField(
        source='city.name',
        read_only=True
    )
    tips = AttractionTipSerializer(many=True, read_only=True)
    tips_count = serializers.IntegerField(
        source='tips.count',
        read_only=True
    )

    class Meta:
        model = Attraction
        fields = [
            'id',
            'city',
            'city_name',
            'name',
            'type',
            'type_display',
            'description',
            'fun_fact',
            'suggested_duration',
            'priority_order',
            'visited',
            'tips',
            'tips_count',
        ]
        read_only_fields = ['id']


class AttractionListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listagem de atrações (sem tips aninhadas).
    Útil para performance em listas grandes.
    """
    type_display = serializers.CharField(
        source='get_type_display',
        read_only=True
    )
    city_name = serializers.CharField(
        source='city.name',
        read_only=True
    )
    tips_count = serializers.IntegerField(
        source='tips.count',
        read_only=True
    )

    class Meta:
        model = Attraction
        fields = [
            'id',
            'city',
            'city_name',
            'name',
            'type',
            'type_display',
            'description',
            'suggested_duration',
            'priority_order',
            'visited',
            'tips_count',
        ]
        read_only_fields = ['id']


class CitySerializer(serializers.ModelSerializer):
    """
    Serializer completo para cidades com atrações aninhadas.
    """
    attractions = AttractionListSerializer(many=True, read_only=True)
    attractions_count = serializers.IntegerField(
        source='attractions.count',
        read_only=True
    )
    duration_days = serializers.SerializerMethodField()

    class Meta:
        model = City
        fields = [
            'id',
            'name',
            'country',
            'description',
            'arrival_date',
            'departure_date',
            'duration_days',
            'attractions',
            'attractions_count',
        ]
        read_only_fields = ['id']

    def get_duration_days(self, obj):
        """
        Calcula a duração da estadia em dias.
        """
        if obj.arrival_date and obj.departure_date:
            delta = obj.departure_date - obj.arrival_date
            return delta.days
        return None

    def validate(self, attrs):
        """
        Valida que a data de partida seja posterior à data de chegada.
        """
        arrival = attrs.get('arrival_date')
        departure = attrs.get('departure_date')

        if arrival and departure and departure <= arrival:
            raise serializers.ValidationError(
                "A data de partida deve ser posterior à data de chegada."
            )

        return attrs


class CityListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listagem de cidades (sem atrações aninhadas).
    Ideal para endpoints de lista com melhor performance.
    """
    attractions_count = serializers.IntegerField(
        source='attractions.count',
        read_only=True
    )
    duration_days = serializers.SerializerMethodField()

    class Meta:
        model = City
        fields = [
            'id',
            'name',
            'country',
            'description',
            'arrival_date',
            'departure_date',
            'duration_days',
            'attractions_count',
        ]
        read_only_fields = ['id']

    def get_duration_days(self, obj):
        """
        Calcula a duração da estadia em dias.
        """
        if obj.arrival_date and obj.departure_date:
            delta = obj.departure_date - obj.arrival_date
            return delta.days
        return None


class CityCreateSerializer(serializers.ModelSerializer):
    """
    Serializer específico para criação de cidades com validações extras.
    """
    class Meta:
        model = City
        fields = [
            'name',
            'country',
            'description',
            'arrival_date',
            'departure_date',
        ]

    def validate(self, attrs):
        """
        Validações customizadas.
        """
        # Valida data de partida posterior à chegada
        arrival = attrs.get('arrival_date')
        departure = attrs.get('departure_date')

        if arrival and departure and departure <= arrival:
            raise serializers.ValidationError(
                "A data de partida deve ser posterior à data de chegada."
            )

        # Valida unicidade de name + country
        name = attrs.get('name')
        country = attrs.get('country')

        if City.objects.filter(name=name, country=country).exists():
            raise serializers.ValidationError(
                f"A cidade '{name}' em '{country}' já está cadastrada."
            )

        return attrs


class AttractionSummarySerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para atrações em resumo de cidades.
    """
    type_display = serializers.CharField(
        source='get_type_display',
        read_only=True
    )

    class Meta:
        model = Attraction
        fields = ['name', 'type', 'type_display', 'suggested_duration', 'priority_order', 'visited']


class CitySummarySerializer(serializers.ModelSerializer):
    """
    Serializer customizado para resumo de cidades com atrações.
    Formata datas no formato 'dd mmm' e inclui informações calculadas.
    """
    arrival_date_formatted = serializers.SerializerMethodField()
    departure_date_formatted = serializers.SerializerMethodField()
    duration_days = serializers.SerializerMethodField()
    attractions_count = serializers.IntegerField(
        source='attractions.count',
        read_only=True
    )
    attractions = AttractionSummarySerializer(many=True, read_only=True)

    class Meta:
        model = City
        fields = [
            'name',
            'arrival_date_formatted',
            'departure_date_formatted',
            'duration_days',
            'attractions_count',
            'attractions',
        ]

    def get_arrival_date_formatted(self, obj):
        """
        Formata a data de chegada no formato '04 jun'.
        """
        if obj.arrival_date:
            # Mapeamento de meses em português
            months = {
                1: 'jan', 2: 'fev', 3: 'mar', 4: 'abr',
                5: 'mai', 6: 'jun', 7: 'jul', 8: 'ago',
                9: 'set', 10: 'out', 11: 'nov', 12: 'dez'
            }
            day = obj.arrival_date.day
            month = months[obj.arrival_date.month]
            return f"{day:02d} {month}"
        return None

    def get_departure_date_formatted(self, obj):
        """
        Formata a data de partida no formato '04 jun'.
        """
        if obj.departure_date:
            # Mapeamento de meses em português
            months = {
                1: 'jan', 2: 'fev', 3: 'mar', 4: 'abr',
                5: 'mai', 6: 'jun', 7: 'jul', 8: 'ago',
                9: 'set', 10: 'out', 11: 'nov', 12: 'dez'
            }
            day = obj.departure_date.day
            month = months[obj.departure_date.month]
            return f"{day:02d} {month}"
        return None

    def get_duration_days(self, obj):
        """
        Calcula a duração da estadia em dias.
        """
        if obj.arrival_date and obj.departure_date:
            delta = obj.departure_date - obj.arrival_date
            return delta.days
        return None
