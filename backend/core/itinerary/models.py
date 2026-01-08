from django.db import models


class City(models.Model):
    """
    Modelo representando cidades turisticas.
    """
    name = models.CharField(
        'Nome',
        max_length=200,
        help_text='Nome da cidade'
    )
    country = models.CharField(
        'País',
        max_length=100,
        help_text='País onde a cidade está localizada'
    )
    description = models.TextField(
        'Descrição',
        blank=True,
        help_text='Descrição geral da cidade'
    )
    photo = models.ImageField(
        'Foto',
        upload_to='cities/',
        blank=True,
        null=True,
        help_text='Foto representativa da cidade'
    )
    arrival_date = models.DateTimeField('Data da chegada')
    departure_date = models.DateTimeField('Data da partida')

    class Meta:
        verbose_name = 'Cidade'
        verbose_name_plural = 'Cidades'
        ordering = ['country', 'name']
        unique_together = [['name', 'country']]
        indexes = [
            models.Index(fields=['country', 'name']),
        ]

    def __str__(self):
        return f"{self.name} - {self.country}"

class Attraction(models.Model):
    """
    Modelo representando pontos turísticos/atrações.
    """

    # Tipos de atração
    TYPE_CHOICES = [
        ('monument', 'Monumento'),
        ('museum', 'Museu'),
        ('park', 'Parque'),
        ('restaurant', 'Restaurante'),
        ('viewpoint', 'Mirante'),
        ('beach', 'Praia'),
        ('church', 'Igreja/Templo'),
        ('shopping', 'Compras'),
        ('nightlife', 'Vida Noturna'),
        ('other', 'Outro'),
    ]

    city = models.ForeignKey(
        'City',
        on_delete=models.CASCADE,
        related_name='attractions',
        verbose_name='Cidade',
        help_text='Cidade onde a atração está localizada'
    )

    name = models.CharField(
        'Nome',
        max_length=200,
        help_text='Nome da atração'
    )

    type = models.CharField(
        'Tipo',
        max_length=20,
        choices=TYPE_CHOICES,
        default='other',
        help_text='Categoria da atração'
    )

    description = models.TextField(
        'Descrição',
        blank=True,
        help_text='Descrição detalhada da atração'
    )

    fun_fact = models.TextField(
        'Curiosidade',
        blank=True,
        help_text='Uma curiosidade ou fato interessante sobre a atração'
    )

    photo = models.ImageField(
        'Foto',
        upload_to='attractions/',
        blank=True,
        null=True,
        help_text='Foto representativa da atração'
    )

    suggested_duration = models.IntegerField(
        'Tempo sugerido (minutos)',
        null=True,
        blank=True,
        help_text='Tempo sugerido de permanência na atração em minutos'
    )

    priority_order = models.IntegerField(
        'Ordem de prioridade',
        null=True,
        blank=True,
        help_text='Ordem de prioridade da visita (1 = mais prioritária)'
    )

    visited = models.BooleanField(
        'Visitado',
        default=False,
        help_text='Indica se a atração já foi visitada'
    )

    class Meta:
        verbose_name = 'Atração'
        verbose_name_plural = 'Atrações'
        ordering = ['name']
        indexes = [
            models.Index(fields=['city', 'type']),
        ]

    def __str__(self):
        return f"{self.name} - {self.city.name}"

class AttractionTip(models.Model):
    """
    Modelo para dicas e recomendações sobre atrações.
    Usuários podem compartilhar dicas úteis sobre as atrações.
    """

    # Tipos de atração
    TIP_CHOICES = [
        ('todo', 'O que fazer'),
        ('toeat', 'O que comer'),
        ('other', 'Outro'),
    ]

    attraction = models.ForeignKey(
        'Attraction',
        on_delete=models.CASCADE,
        related_name='tips',
        verbose_name='Atração',
        help_text='Atração relacionada à dica'
    )

    title = models.CharField(
        'Título',
        max_length=200,
        help_text='Título resumido da dica'
    )

    category = models.CharField(
        'Categoria',
        max_length=20,
        choices=TIP_CHOICES,
        default='other',
        help_text='Categoria da dica'
    )

    class Meta:
        verbose_name = 'Dica da Atração'
        verbose_name_plural = 'Dicas da Atração'
        ordering = ['attraction', 'category', 'title']
        unique_together = [['title', 'attraction']]
        indexes = [
            models.Index(fields=['attraction']),
        ]

    def __str__(self):
        return f"{self.title} - {self.attraction}"
