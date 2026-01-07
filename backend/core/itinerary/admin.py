from django.contrib import admin
from .models import City, Attraction, AttractionTip


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'arrival_date', 'departure_date')
    list_filter = ('country', 'arrival_date', 'departure_date')
    search_fields = ('name', 'country', 'description')
    ordering = ('country', 'name')
    date_hierarchy = 'arrival_date'

    fieldsets = (
        ('Informações Básicas', {
            'fields': ('name', 'country')
        }),
        ('Descrição', {
            'fields': ('description',),
            'classes': ('wide',)
        }),
        ('Datas da Viagem', {
            'fields': ('arrival_date', 'departure_date'),
            'description': 'Defina as datas de chegada e partida da cidade'
        }),
    )


class AttractionTipInline(admin.TabularInline):
    model = AttractionTip
    extra = 1
    fields = ('title', 'category')
    verbose_name = 'Dica'
    verbose_name_plural = 'Dicas'


@admin.register(Attraction)
class AttractionAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'type', 'get_country')
    list_filter = ('type', 'city__country', 'city')
    search_fields = ('name', 'description', 'fun_fact', 'city__name')
    ordering = ('city', 'name')
    autocomplete_fields = ['city']

    fieldsets = (
        ('Informações Básicas', {
            'fields': ('city', 'name', 'type')
        }),
        ('Detalhes', {
            'fields': ('description', 'fun_fact'),
            'classes': ('wide',)
        }),
    )

    inlines = [AttractionTipInline]

    def get_country(self, obj):
        return obj.city.country
    get_country.short_description = 'País'
    get_country.admin_order_field = 'city__country'


@admin.register(AttractionTip)
class AttractionTipAdmin(admin.ModelAdmin):
    list_display = ('title', 'attraction', 'category', 'get_city')
    list_filter = ('category', 'attraction__city__country', 'attraction__city')
    search_fields = ('title', 'attraction__name', 'attraction__city__name')
    ordering = ('attraction', 'title')
    autocomplete_fields = ['attraction']

    fieldsets = (
        ('Informações da Dica', {
            'fields': ('attraction', 'title', 'category')
        }),
    )

    def get_city(self, obj):
        return obj.attraction.city.name
    get_city.short_description = 'Cidade'
    get_city.admin_order_field = 'attraction__city__name'
