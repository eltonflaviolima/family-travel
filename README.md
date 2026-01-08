# Travel API

API para gerenciamento de cidades turísticas, atrações e dicas de viagem.

## 📌 Funcionalidades

- Cadastro de cidades turísticas
- Cadastro de atrações
- Dicas associadas às atrações
- Filtros avançados
- Estatísticas automáticas
- Endpoints REST completos
- Swagger UI para documentação

---

## 🚀 Instalação

### 1. Clone o repositório
```
git clone <repo-url>
```
### 2. Instale dependências
```
pip install -r requirements.txt
```
### 3. Execute migrações
```
python manage.py migrate
```
### 4. Inicie o servidor
```
python manage.py runserver
```

---

## 📘 Documentação (Swagger)

Acesse:

- Swagger UI: `/swagger/`
- OpenAPI JSON: `/swagger.json`
- OpenAPI YAML: `/swagger.yaml`

---

## 📂 Endpoints principais

### Cities
- `GET /api/itinerary/cities/`
- `POST /api/itinerary/cities/`
- `GET /api/itinerary/cities/{id}/`
- `GET /api/itinerary/cities/upcoming/`
- `GET /api/itinerary/cities/current/`
- `GET /api/itinerary/cities/past/`
- `GET /api/itinerary/cities/by_country/`
- `GET /api/itinerary/cities/{id}/statistics/`

### Attractions
- `GET /api/itinerary/attractions/`
- `POST /api/itinerary/attractions/`
- `GET /api/itinerary/attractions/by_type/?type=x`
- `GET /api/itinerary/attractions/popular/`
- `POST /api/itinerary/attractions/{id}/add_tip/`

### Tips
- `GET /api/itinerary/tips/`
- `POST /api/itinerary/tips/`
- `GET /api/itinerary/tips/by_category/?category=food`
- `GET /api/itinerary/tips/statistics/`