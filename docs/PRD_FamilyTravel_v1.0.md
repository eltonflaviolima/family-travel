# 📋 Documentação de Requisitos - MVP Travel App Europa 2026

## 1. VISÃO GERAL DO PROJETO

### 1.1 Objetivo
Desenvolver um aplicativo mobile para acompanhamento do roteiro de viagem pela Europa (Junho 2026), permitindo que a família Elton acompanhe o itinerário, marque locais visitados, compartilhe fotos e notas da viagem.

### 1.2 Usuários
- **Público-alvo:** Família Elton (4-6 pessoas)
- **Perfil:** Viajantes organizados que querem ter o roteiro sempre à mão
- **Dispositivos:** iPhones e smartphones Android

### 1.3 Escopo do MVP
**Duração estimada de desenvolvimento:** 3 semanas
**Plataformas:** iOS e Android
**Modo de distribuição:** TestFlight (iOS) e APK direto (Android)

---

## 2. REQUISITOS FUNCIONAIS

### 2.1 Módulo de Autenticação (RF-001 a RF-003)

#### RF-001: Login de usuário
**Descrição:** Sistema de autenticação para membros da família
**Prioridade:** Alta
**Critérios de aceitação:**
- [ ] Usuário pode fazer login com email e senha
- [ ] Sistema retorna token JWT válido por 7 dias
- [ ] Mensagens de erro claras para credenciais inválidas
- [ ] Token é armazenado localmente no app

**Endpoint:** `POST /api/auth/login/`
```json
Request:
{
  "email": "elton@example.com",
  "password": "senha123"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "name": "Elton",
    "email": "elton@example.com"
  }
}
```

---

#### RF-002: Cadastro de usuário (Admin)
**Descrição:** Apenas admin pode cadastrar novos membros da família
**Prioridade:** Alta
**Critérios de aceitação:**
- [ ] Admin pode criar usuários via Django Admin
- [ ] Campos obrigatórios: nome, email, senha
- [ ] Email deve ser único no sistema
- [ ] Senha é criptografada automaticamente

**Implementação:** Via Django Admin apenas (não precisa endpoint público)

---

#### RF-003: Atualização de perfil
**Descrição:** Usuário pode atualizar foto e informações pessoais
**Prioridade:** Baixa (pode ficar para v2)
**Critérios de aceitação:**
- [ ] Usuário pode atualizar nome
- [ ] Usuário pode fazer upload de foto de perfil
- [ ] Mudanças são salvas instantaneamente

**Endpoint:** `PATCH /api/auth/me/`

---

### 2.2 Módulo de Roteiro/Itinerário (RF-004 a RF-008)

#### RF-004: Listar dias da viagem
**Descrição:** Exibir timeline com todos os dias da viagem
**Prioridade:** Alta
**Critérios de aceitação:**
- [ ] Lista todos os dias em ordem cronológica
- [ ] Mostra: data, dia da semana, cidade, bandeira do país
- [ ] Mostra quantidade de atrações por dia
- [ ] Carregamento rápido (<2s)

**Endpoint:** `GET /api/itinerary/days/`
```json
Response:
[
  {
    "id": 1,
    "date": "2026-06-01",
    "day_of_week": "Domingo",
    "city": {
      "id": 1,
      "name": "Lisboa",
      "country": "Portugal",
      "flag": "🇵🇹"
    },
    "attractions_count": 1
  },
  {
    "id": 2,
    "date": "2026-06-02",
    "day_of_week": "Segunda",
    "city": {
      "id": 1,
      "name": "Lisboa",
      "country": "Portugal",
      "flag": "🇵🇹"
    },
    "attractions_count": 6
  }
]
```

---

#### RF-005: Listar atrações de um dia
**Descrição:** Ao expandir um dia, exibir todas as atrações
**Prioridade:** Alta
**Critérios de aceitação:**
- [ ] Lista atrações em ordem cronológica (por horário)
- [ ] Mostra: nome, horário, tipo, ícone
- [ ] Indica se já foi visitada (via checklist)
- [ ] Carregamento instantâneo

**Endpoint:** `GET /api/itinerary/days/{day_id}/attractions/`
```json
Response:
[
  {
    "id": 1,
    "name": "Mosteiro dos Jerónimos",
    "time": "09h",
    "type": "monument",
    "icon": "🏛️",
    "image_thumbnail": "https://cdn.../jeronimos_thumb.jpg",
    "visited": false,
    "order": 1
  },
  {
    "id": 2,
    "name": "Torre de Belém",
    "time": "11h30",
    "type": "monument",
    "icon": "🏛️",
    "image_thumbnail": "https://cdn.../torre_thumb.jpg",
    "visited": true,
    "order": 2
  }
]
```

---

#### RF-006: Detalhes de uma atração
**Descrição:** Exibir informações completas sobre uma atração
**Prioridade:** Alta
**Critérios de aceitação:**
- [ ] Mostra: foto, nome, horário, descrição, curiosidade
- [ ] Mostra lista "O que fazer aqui?" (checklist visual)
- [ ] Mostra lista "O que comer aqui?" (tags)
- [ ] Seções expansíveis/colapsáveis
- [ ] Carregamento rápido da imagem

**Endpoint:** `GET /api/attractions/{id}/`
```json
Response:
{
  "id": 1,
  "name": "Mosteiro dos Jerónimos",
  "time": "09h",
  "type": "monument",
  "icon": "🏛️",
  "image_url": "https://cdn.../jeronimos.jpg",
  "description": "Obra-prima da arquitetura manuelina...",
  "curiosity": "O mosteiro levou 100 anos para ser concluído...",
  "day": {
    "date": "2026-06-02",
    "city": "Lisboa"
  },
  "tips": {
    "todo": [
      "Visitar a igreja de Santa Maria",
      "Admirar o claustro manuelino",
      "Ver os túmulos de Vasco da Gama e Camões"
    ],
    "eat": [
      "Pastéis de Belém",
      "Travesseiros de Sintra",
      "Ginjinha em copinho de chocolate"
    ]
  },
  "photos_count": 3,
  "visited": false
}
```

---

#### RF-007: Buscar atrações
**Descrição:** Buscar atrações por nome ou cidade
**Prioridade:** Média
**Critérios de aceitação:**
- [ ] Busca por nome da atração
- [ ] Busca por nome da cidade
- [ ] Resultados aparecem enquanto digita
- [ ] Máximo 20 resultados

**Endpoint:** `GET /api/attractions/?search={query}`

---

#### RF-008: Filtrar atrações por tipo
**Descrição:** Filtrar atrações (monumentos, palácios, etc)
**Prioridade:** Baixa (v2)
**Endpoint:** `GET /api/attractions/?type=monument`

---

### 2.3 Módulo de Checklist (RF-009 a RF-011)

#### RF-009: Marcar atração como visitada
**Descrição:** Usuário pode marcar que já visitou uma atração
**Prioridade:** Alta
**Critérios de aceitação:**
- [ ] Toggle simples (visitado/não visitado)
- [ ] Salva timestamp da visita
- [ ] Mudança reflete instantaneamente na UI
- [ ] Funciona offline (sincroniza depois)

**Endpoint:** `POST /api/checklist/`
```json
Request:
{
  "attraction_id": 1,
  "visited": true
}

Response:
{
  "id": 1,
  "attraction": 1,
  "user": 1,
  "visited": true,
  "visited_at": "2026-06-02T09:45:00Z",
  "notes": ""
}
```

---

#### RF-010: Adicionar notas a uma atração
**Descrição:** Usuário pode escrever notas/comentários sobre a visita
**Prioridade:** Média
**Critérios de aceitação:**
- [ ] Campo de texto livre (até 500 caracteres)
- [ ] Salva automaticamente
- [ ] Notas são privadas (cada usuário vê só as suas)

**Endpoint:** `PATCH /api/checklist/{id}/`
```json
Request:
{
  "notes": "Lugar incrível! Chegamos às 9h e pegamos pouca fila."
}
```

---

#### RF-011: Ver progresso geral da viagem
**Descrição:** Dashboard com estatísticas da viagem
**Prioridade:** Baixa (v2)
**Critérios de aceitação:**
- [ ] Mostra: X% atrações visitadas
- [ ] Mostra: Atrações por cidade
- [ ] Mostra: Gráfico de progresso

**Endpoint:** `GET /api/checklist/stats/`

---

### 2.4 Módulo de Fotos (RF-012 a RF-015)

#### RF-012: Upload de foto
**Descrição:** Usuário pode fazer upload de fotos em cada atração
**Prioridade:** Alta
**Critérios de aceitação:**
- [ ] Upload de 1 foto por vez (JPEG/PNG)
- [ ] Máximo 5MB por foto
- [ ] Compressão automática no app antes do upload
- [ ] Mostra preview antes de confirmar
- [ ] Adicionar legenda opcional

**Endpoint:** `POST /api/photos/`
```json
Request (multipart/form-data):
{
  "attraction": 1,
  "image": <file>,
  "caption": "Vista linda do mosteiro!"
}

Response:
{
  "id": 1,
  "attraction": 1,
  "user": {
    "id": 1,
    "name": "Elton"
  },
  "image_url": "https://cdn.../photo_1.jpg",
  "thumbnail_url": "https://cdn.../photo_1_thumb.jpg",
  "caption": "Vista linda do mosteiro!",
  "uploaded_at": "2026-06-02T10:30:00Z"
}
```

---

#### RF-013: Galeria de fotos de uma atração
**Descrição:** Ver todas as fotos compartilhadas pela família em uma atração
**Prioridade:** Alta
**Critérios de aceitação:**
- [ ] Grid de fotos (2 colunas)
- [ ] Mostra nome de quem tirou
- [ ] Mostra legenda (se houver)
- [ ] Tap para ver em tela cheia
- [ ] Ordenadas por data (mais recentes primeiro)

**Endpoint:** `GET /api/photos/?attraction={id}`

---

#### RF-014: Deletar foto
**Descrição:** Usuário pode deletar suas próprias fotos
**Prioridade:** Média
**Critérios de aceitação:**
- [ ] Só pode deletar as próprias fotos
- [ ] Confirmação antes de deletar
- [ ] Remove do servidor também

**Endpoint:** `DELETE /api/photos/{id}/`

---

#### RF-015: Feed de fotos recentes
**Descrição:** Timeline com fotos recentes de toda a família
**Prioridade:** Baixa (v2)
**Endpoint:** `GET /api/photos/recent/`

---

### 2.5 Módulo de Notificações (RF-016 a RF-017)

#### RF-016: Notificação de lembrete
**Descrição:** Notificação push 30min antes da atração
**Prioridade:** Baixa (v2)
**Critérios de aceitação:**
- [ ] Notificação local (não precisa servidor)
- [ ] Baseada no horário da atração
- [ ] Usuário pode desabilitar por atração

---

#### RF-017: Notificação de nova foto
**Descrição:** Notificar quando alguém da família posta foto
**Prioridade:** Baixa (v2)

---

## 3. REQUISITOS NÃO FUNCIONAIS

### 3.1 Performance (RNF-001 a RNF-003)

#### RNF-001: Tempo de resposta da API
- [ ] 95% das requisições devem responder em <1s
- [ ] Listar dias deve responder em <500ms
- [ ] Upload de foto deve completar em <5s

#### RNF-002: Tamanho do app
- [ ] App instalado deve ter <50MB
- [ ] Download inicial <20MB

#### RNF-003: Uso de dados
- [ ] App deve funcionar offline (dados em cache)
- [ ] Sincronização inteligente (só quando necessário)
- [ ] Opção "baixar tudo" para modo offline

---

### 3.2 Segurança (RNF-004 a RNF-007)

#### RNF-004: Autenticação
- [ ] JWT com expiração de 7 dias
- [ ] Refresh token com expiração de 30 dias
- [ ] Logout deve invalidar token

#### RNF-005: Autorização
- [ ] Usuário só vê/edita seus próprios dados (checklist, notas)
- [ ] Usuário vê fotos de todos (compartilhadas)
- [ ] Apenas admin pode adicionar/editar roteiro

#### RNF-006: Comunicação
- [ ] Todas as requisições via HTTPS
- [ ] Dados sensíveis (senha) nunca em logs

#### RNF-007: Armazenamento
- [ ] Senhas hashadas com bcrypt
- [ ] Tokens criptografados no dispositivo

---

### 3.3 Usabilidade (RNF-008 a RNF-011)

#### RNF-008: Interface
- [ ] Design mobile-first
- [ ] Seguir guidelines iOS (Human Interface) e Android (Material Design)
- [ ] Suporte a modo escuro (opcional para v2)

#### RNF-009: Acessibilidade
- [ ] Fontes legíveis (mínimo 14px)
- [ ] Contraste adequado (WCAG AA)
- [ ] Suporte a VoiceOver/TalkBack (v2)

#### RNF-010: Idioma
- [ ] Português brasileiro apenas (MVP)
- [ ] Preparado para internacionalização (v2)

#### RNF-011: Feedback visual
- [ ] Loading states em todas as ações assíncronas
- [ ] Mensagens de erro claras e acionáveis
- [ ] Confirmações de sucesso

---

### 3.4 Compatibilidade (RNF-012 a RNF-013)

#### RNF-012: Dispositivos
- [ ] iOS 13.0+
- [ ] Android 8.0+ (API level 26)
- [ ] Telas de 4.7" a 6.7"

#### RNF-013: Orientação
- [ ] Portrait (vertical) apenas
- [ ] Landscape opcional (v2)

---

### 3.5 Confiabilidade (RNF-014 a RNF-015)

#### RNF-014: Disponibilidade
- [ ] Backend disponível 99% do tempo
- [ ] App funciona offline (dados em cache)

#### RNF-015: Backup
- [ ] Backup automático do banco diário
- [ ] Fotos salvas em storage persistente

---

## 4. MODELO DE DADOS

### 4.1 Diagrama Entidade-Relacionamento

```
┌──────────────┐       ┌──────────────┐       ┌──────────────────┐
│    User      │       │     City     │       │    Attraction    │
├──────────────┤       ├──────────────┤       ├──────────────────┤
│ id (PK)      │       │ id (PK)      │   ┌───│ id (PK)          │
│ name         │       │ name         │   │   │ city_id (FK)     │
│ email        │       │ country      │◄──┘   │ name             │
│ password     │       │ flag         │       │ time             │
│ profile_pic  │       │ date         │       │ type             │
│ created_at   │       │ day_of_week  │       │ image_url        │
└──────┬───────┘       └──────────────┘       │ description      │
       │                                       │ curiosity        │
       │                                       │ order            │
       │                                       └────────┬─────────┘
       │                                                │
       │               ┌──────────────────┐            │
       │               │  AttractionTip   │            │
       │               ├──────────────────┤            │
       │           ┌───│ id (PK)          │            │
       │           │   │ attraction_id(FK)│◄───────────┘
       │           │   │ category         │
       │           │   │ text             │
       │           │   │ order            │
       │           │   └──────────────────┘
       │           │
       │           │   ┌──────────────────┐
       │           │   │   Checklist      │
       │           │   ├──────────────────┤
       │           └───│ id (PK)          │
       │               │ attraction_id(FK)│◄───────────┐
       └───────────────│ user_id (FK)     │            │
                       │ visited          │            │
                       │ notes            │            │
                       │ visited_at       │            │
                       └──────────────────┘            │
                                                       │
                       ┌──────────────────┐            │
                       │     Photo        │            │
                       ├──────────────────┤            │
                   ┌───│ id (PK)          │            │
                   │   │ attraction_id(FK)│◄───────────┘
                   │   │ user_id (FK)     │
                   └───│ image            │
                       │ caption          │
                       │ uploaded_at      │
                       └──────────────────┘
```

---

### 4.2 Detalhamento das Tabelas

#### Tabela: User
```python
Field           Type            Constraints
─────────────────────────────────────────────
id              Integer         Primary Key, Auto Increment
name            String(100)     Not Null
email           String(255)     Unique, Not Null
password        String(128)     Not Null (hashed)
profile_pic     ImageField      Nullable
created_at      DateTime        Auto Now Add
updated_at      DateTime        Auto Now
```

#### Tabela: City
```python
Field           Type            Constraints
─────────────────────────────────────────────
id              Integer         Primary Key, Auto Increment
name            String(100)     Not Null
country         String(100)     Not Null
flag            String(10)      Not Null (emoji)
date            Date            Not Null
day_of_week     String(20)      Not Null
created_at      DateTime        Auto Now Add
```

#### Tabela: Attraction
```python
Field           Type            Constraints
─────────────────────────────────────────────
id              Integer         Primary Key, Auto Increment
city_id         Integer         Foreign Key (City), On Delete Cascade
name            String(200)     Not Null
time            String(20)      Not Null (ex: "09h", "14h30")
type            String(50)      Not Null (monument, palace, etc)
image_url       URLField        Not Null
description     Text            Not Null
curiosity       Text            Not Null
order           Integer         Default 0 (ordem no dia)
created_at      DateTime        Auto Now Add
updated_at      DateTime        Auto Now
```

#### Tabela: AttractionTip
```python
Field           Type            Constraints
─────────────────────────────────────────────
id              Integer         Primary Key, Auto Increment
attraction_id   Integer         Foreign Key (Attraction), On Delete Cascade
category        String(20)      Not Null ('todo' ou 'eat')
text            String(500)     Not Null
order           Integer         Default 0
created_at      DateTime        Auto Now Add
```

#### Tabela: Checklist
```python
Field           Type            Constraints
─────────────────────────────────────────────
id              Integer         Primary Key, Auto Increment
attraction_id   Integer         Foreign Key (Attraction), On Delete Cascade
user_id         Integer         Foreign Key (User), On Delete Cascade
visited         Boolean         Default False
notes           Text            Nullable, Blank
visited_at      DateTime        Nullable
created_at      DateTime        Auto Now Add
updated_at      DateTime        Auto Now

Unique Together: (attraction_id, user_id)
```

#### Tabela: Photo
```python
Field           Type            Constraints
─────────────────────────────────────────────
id              Integer         Primary Key, Auto Increment
attraction_id   Integer         Foreign Key (Attraction), On Delete Cascade
user_id         Integer         Foreign Key (User), On Delete Cascade
image           ImageField      Not Null (upload_to='photos/')
caption         Text            Nullable, Blank
uploaded_at     DateTime        Auto Now Add

Index: attraction_id, uploaded_at (para queries rápidas)
```

---

## 5. ARQUITETURA DO SISTEMA

### 5.1 Visão Geral

```
┌────────────────────────────────────────────┐
│         CAMADA DE APRESENTAÇÃO             │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │   React Native App (Expo)            │ │
│  │                                      │ │
│  │  - Navegação (React Navigation)     │ │
│  │  - Gerenciamento de Estado (Redux)  │ │
│  │  - Cache local (AsyncStorage)       │ │
│  │  - Upload de imagens (Expo ImageP.) │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
                    ↕ HTTPS/REST
┌────────────────────────────────────────────┐
│            CAMADA DE APLICAÇÃO             │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │   Django REST Framework              │ │
│  │                                      │ │
│  │  - ViewSets (API endpoints)         │ │
│  │  - Serializers (validação)          │ │
│  │  - Permissions (autorização)        │ │
│  │  - Authentication (JWT)             │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │   Django Admin                       │ │
│  │  - Gerenciamento de conteúdo        │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
                    ↕
┌────────────────────────────────────────────┐
│          CAMADA DE PERSISTÊNCIA            │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │   PostgreSQL Database                │ │
│  │  - Dados estruturados                │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │   File Storage (Media Files)         │ │
│  │  - Fotos uploaded pelos usuários     │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

---

### 5.2 Stack Tecnológico

#### Backend
- **Framework:** Django 4.2 + Django REST Framework 3.14
- **Linguagem:** Python 3.11
- **Banco de dados:** PostgreSQL 15
- **Autenticação:** djangorestframework-simplejwt
- **CORS:** django-cors-headers
- **Servidor produção:** Gunicorn
- **Storage:** WhiteNoise (arquivos estáticos) + Railway Storage (media)

#### Frontend
- **Framework:** React Native (via Expo SDK 50)
- **Linguagem:** JavaScript/TypeScript
- **Navegação:** React Navigation 6
- **Estado:** Redux Toolkit ou Context API
- **HTTP Client:** Axios
- **Ícones:** lucide-react-native
- **Cache:** AsyncStorage

#### DevOps
- **Hosting:** Railway (backend) ou Render
- **CI/CD:** GitHub Actions (opcional)
- **Versionamento:** Git + GitHub
- **Documentação API:** drf-spectacular (Swagger/OpenAPI)

---

### 5.3 Estrutura de Pastas

#### Backend (Django)
```
travel-backend/
├── manage.py
├── requirements.txt
├── .env
├── .gitignore
├── README.md
│
├── config/                    # Configurações principais
│   ├── __init__.py
│   ├── settings.py           # Settings principal
│   ├── urls.py               # URLs raiz
│   ├── wsgi.py
│   └── asgi.py
│
├── apps/
│   ├── authentication/       # App de autenticação
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tests.py
│   │
│   ├── itinerary/           # App principal (roteiro)
│   │   ├── models.py        # City, Attraction, AttractionTip
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── tests.py
│   │
│   ├── checklist/           # App de checklist
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tests.py
│   │
│   └── photos/              # App de fotos
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       └── tests.py
│
├── media/                   # Uploads (fotos)
│   └── photos/
│
└── staticfiles/            # Arquivos estáticos (CSS admin)
```

#### Frontend (React Native)
```
travel-app/
├── package.json
├── app.json
├── babel.config.js
├── .gitignore
│
├── src/
│   ├── api/                 # Configuração Axios + endpoints
│   │   ├── axios.js
│   │   ├── auth.js
│   │   ├── itinerary.js
│   │   ├── checklist.js
│   │   └── photos.js
│   │
│   ├── components/          # Componentes reutilizáveis
│   │   ├── DayCard.js
│   │   ├── AttractionCard.js
│   │   ├── CollapsibleSection.js
│   │   ├── PhotoGallery.js
│   │   └── LoadingSpinner.js
│   │
│   ├── screens/             # Telas principais
│   │   ├── LoginScreen.js
│   │   ├── TimelineScreen.js
│   │   ├── AttractionDetailScreen.js
│   │   ├── PhotoGalleryScreen.js
│   │   └── ProfileScreen.js
│   │
│   ├── navigation/          # Navegação
│   │   └── AppNavigator.js
│   │
│   ├── store/              # Redux (se usar)
│   │   ├── store.js
│   │   ├── authSlice.js
│   │   └── itinerarySlice.js
│   │
│   ├── utils/              # Utilitários
│   │   ├── storage.js      # AsyncStorage helpers
│   │   ├── date.js         # Formatação de datas
│   │   └── image.js        # Compressão de imagens
│   │
│   └── constants/          # Constantes
│       ├── colors.js
│       └── api.js          # Base URL
│
├── assets/                 # Imagens, fonts
│   ├── images/
│   └── fonts/
│
└── App.js                  # Entry point
```

---

## 6. FLUXOS DE USUÁRIO

### 6.1 Fluxo de Autenticação
```
┌──────────┐
│  Início  │
└────┬─────┘
     │
     ▼
┌─────────────────┐
│ Tela de Login   │
│ - Email         │
│ - Senha         │
└────┬─────┬──────┘
     │     │
     │     └─(erro)──► Mensagem de erro
     │
     ▼ (sucesso)
┌─────────────────┐
│ Salvar token    │
│ no AsyncStorage │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Tela Principal  │
│ (Timeline)      │
└─────────────────┘
```

---

### 6.2 Fluxo de Navegação Principal
```
┌──────────────────┐
│  Timeline        │◄────┐
│  (Lista de dias) │     │
└────┬─────────────┘     │
     │                   │
     │ (tap em dia)      │
     ▼                   │
┌──────────────────┐     │
│  Lista Atrações  │     │ (voltar)
│  (do dia)        │     │
└────┬─────────────┘     │
     │                   │
     │ (tap em atração)  │
     ▼                   │
┌──────────────────┐     │
│  Detalhes        │─────┘
│  Atração         │
│                  │
│  - Descrição     │
│  - Curiosidade   │
│  - Dicas         │
│  - Comidas       │
│  - Galeria       │
└──────────────────┘
```

---

### 6.3 Fluxo de Upload de Foto
```
┌────────────────────┐
│ Detalhes Atração   │
└────┬───────────────┘
     │
     │ (tap "Adicionar Foto")
     ▼
┌────────────────────┐
│ Seletor de Imagem  │
│ - Câmera           │
│ - Galeria          │
└────┬───────────────┘
     │
     ▼
┌────────────────────┐
│ Preview + Caption  │
│ [Imagem]           │
│ [Campo texto]      │
│ [Confirmar]        │
└────┬───────────────┘
     │
     ▼
┌────────────────────┐
│ Compressão +       │
│ Upload             │
│ (loading)          │
└────┬───────────────┘
     │
     ▼
┌────────────────────┐
│ Sucesso!           │
│ Foto aparece na    │
│ galeria            │
└────────────────────┘
```

---

### 6.4 Fluxo de Checklist
```
┌────────────────────┐
│ Lista Atrações     │
│                    │
│ [✓] Mosteiro       │ ◄─ (já visitado)
│ [ ] Torre          │ ◄─ (não visitado)
│ [ ] Padrão         │
└────┬───────────────┘
     │
     │ (tap no checkbox)
     ▼
┌────────────────────┐
│ API: POST          │
│ /checklist/        │
│ {visited: true}    │
└────┬───────────────┘
     │
     ▼
┌────────────────────┐
│ UI atualiza        │
│ instantaneamente   │
│ [✓] Torre          │ ◄─ agora marcado
└────────────────────┘
```

---

## 7. API ENDPOINTS - RESUMO

### 7.1 Autenticação
```
POST   /api/auth/login/           # Login
POST   /api/auth/refresh/         # Refresh token
POST   /api/auth/logout/          # Logout (blacklist token)
GET    /api/auth/me/              # Dados do usuário logado
PATCH  /api/auth/me/              # Atualizar perfil
```

### 7.2 Itinerário
```
GET    /api/itinerary/days/                    # Lista todos os dias
GET    /api/itinerary/days/{id}/               # Detalhes de um dia
GET    /api/itinerary/days/{id}/attractions/   # Atrações de um dia

GET    /api/attractions/                       # Lista todas atrações
GET    /api/attractions/{id}/                  # Detalhes de atração
GET    /api/attractions/?search={query}        # Buscar atrações
GET    /api/attractions/?type={type}           # Filtrar por tipo
```

### 7.3 Checklist
```
GET    /api/checklist/                         # Checklist do usuário
POST   /api/checklist/                         # Criar/atualizar checklist
GET    /api/checklist/{id}/                    # Detalhes checklist
PATCH  /api/checklist/{id}/                    # Atualizar (notas)
DELETE /api/checklist/{id}/                    # Deletar
```

### 7.4 Fotos
```
GET    /api/photos/                            # Todas fotos do usuário
POST   /api/photos/                            # Upload foto
GET    /api/photos/{id}/                       # Detalhes foto
DELETE /api/photos/{id}/                       # Deletar foto
GET    /api/photos/?attraction={id}            # Fotos de atração
```

---

## 8. CRONOGRAMA DE DESENVOLVIMENTO

### **Semana 1: Backend + Infraestrutura**

#### Dia 1-2: Setup inicial
- [ ] Criar projeto Django
- [ ] Configurar PostgreSQL local
- [ ] Criar models (User, City, Attraction, etc)
- [ ] Fazer migrations
- [ ] Configurar Django Admin customizado
- [ ] Popular banco com dados do roteiro

#### Dia 3-4: API - Parte 1
- [ ] Configurar Django REST Framework
- [ ] Implementar autenticação JWT
- [ ] Criar serializers
- [ ] Criar endpoints de itinerário (days, attractions)
- [ ] Testar endpoints com Postman

#### Dia 5-6: API - Parte 2
- [ ] Implementar checklist endpoints
- [ ] Implementar photos endpoints
- [ ] Configurar upload de arquivos
- [ ] Testes unitários básicos
- [ ] Documentação Swagger

#### Dia 7: Deploy
- [ ] Criar conta Railway
- [ ] Configurar variáveis de ambiente
- [ ] Deploy backend
- [ ] Configurar PostgreSQL no Railway
- [ ] Popular banco de produção
- [ ] Testar API em produção

---

### **Semana 2: Frontend Mobile**

#### Dia 8-9: Setup React Native
- [ ] Criar projeto Expo
- [ ] Configurar navegação (React Navigation)
- [ ] Criar estrutura de pastas
- [ ] Configurar Axios
- [ ] Criar tela de login funcional

#### Dia 10-11: Telas principais
- [ ] Tela Timeline (lista de dias)
- [ ] Tela de atrações do dia
- [ ] Componente DayCard
- [ ] Componente AttractionCard
- [ ] Integrar com API

#### Dia 12-13: Tela de detalhes
- [ ] Tela de detalhes da atração
- [ ] Seções colapsáveis
- [ ] Integração checklist
- [ ] Botão de marcar visitado

#### Dia 14: Funcionalidade de fotos
- [ ] Seletor de imagens
- [ ] Compressão de imagens
- [ ] Upload para API
- [ ] Galeria de fotos

---

### **Semana 3: Refinamento + Deploy**

#### Dia 15-16: Polimento
- [ ] Loading states
- [ ] Mensagens de erro
- [ ] Validações
- [ ] Cache local (AsyncStorage)
- [ ] Modo offline básico

#### Dia 17-18: Testes
- [ ] Testar em iPhone real
- [ ] Testar em Android real
- [ ] Corrigir bugs
- [ ] Ajustar layout para diferentes telas

#### Dia 19-20: Build + Distribuição
- [ ] Build iOS (eas build)
- [ ] Build Android (APK)
- [ ] Configurar TestFlight
- [ ] Enviar para família testar
- [ ] Coletar feedback

#### Dia 21: Ajustes finais
- [ ] Implementar feedback da família
- [ ] Documentação final
- [ ] Release v1.0

---

## 9. CRITÉRIOS DE ACEITAÇÃO DO MVP

### 9.1 Funcional
- [ ] Família consegue fazer login
- [ ] Timeline carrega em menos de 2 segundos
- [ ] Atrações são exibidas corretamente
- [ ] Detalhes das atrações são completos e legíveis
- [ ] Checklist funciona (marcar/desmarcar)
- [ ] Upload de fotos funciona
- [ ] Galeria exibe fotos de todos os usuários
- [ ] App funciona offline (dados em cache)

### 9.2 Técnico
- [ ] 95% dos endpoints respondem em <1s
- [ ] Nenhum erro crítico (crash)
- [ ] App funciona em iOS 13+ e Android 8+
- [ ] Código versionado no GitHub
- [ ] README com instruções de instalação

### 9.3 Usabilidade
- [ ] Interface intuitiva (família usa sem instruções)
- [ ] Fotos carregam rapidamente
- [ ] Transições suaves entre telas
- [ ] Feedback visual em todas as ações

---

## 10. RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| API lenta no Railway free tier | Média | Médio | Implementar cache agressivo no app |
| Limite de storage de fotos | Baixa | Alto | Compressão + limitar 5MB por foto |
| Expo build falhar no iOS | Média | Alto | Testar build na semana 2 |
| Família não conseguir instalar | Baixa | Médio | Tutorial em vídeo + suporte direto |
| Dados incorretos no roteiro | Alta | Baixo | Revisão manual antes do deploy |
| App muito pesado | Baixa | Médio | Code splitting + lazy loading |

---

## 11. MÉTRICAS DE SUCESSO

### KPIs do MVP
- **Taxa de adoção:** 100% da família usando o app
- **Uptime:** 99% do backend
- **Tempo de resposta:** <1s para 95% das requisições
- **Fotos compartilhadas:** Média de 5 fotos por atração
- **Taxa de checklist:** 80% das atrações marcadas durante a viagem
- **Crashes:** 0 crashes críticos
- **Satisfação:** 4.5/5 (feedback da família)

---

## 12. PRÓXIMOS PASSOS (PÓS-MVP)

### Versão 2.0 (Possíveis features)
- [ ] Notificações push
- [ ] Modo escuro
- [ ] Compartilhar fotos no Instagram/WhatsApp
- [ ] Exportar roteiro em PDF
- [ ] Controle de gastos por dia
- [ ] Integração com Google Maps
- [ ] Timeline colaborativa (comentários)
- [ ] Estatísticas da viagem
- [ ] Multi-idioma (inglês)
- [ ] Widget iOS/Android

---

## 13. ANEXOS

### 13.1 Glossário
- **MVP:** Minimum Viable Product (produto mínimo viável)
- **JWT:** JSON Web Token (padrão de autenticação)
- **DRF:** Django REST Framework
- **API:** Application Programming Interface
- **CRUD:** Create, Read, Update, Delete
- **RNF:** Requisito Não Funcional
- **RF:** Requisito Funcional

### 13.2 Referências
- Django REST Framework: https://www.django-rest-framework.org/
- React Native: https://reactnative.dev/
- Expo: https://expo.dev/
- Railway: https://railway.app/

---

## 14. APROVAÇÕES

| Stakeholder | Função | Aprovação | Data |
|-------------|--------|-----------|------|
| Elton | Product Owner | ⬜ Pendente | ___/___/___ |

---

**Versão:** 1.0  
**Data:** 06/01/2025  
**Autor:** Claude (Assistente de IA)  
**Revisor:** Elton  

---

🎯 **Próximo passo:** Após aprovação desta documentação, iniciar desenvolvimento da Semana 1 (Backend + Infraestrutura)
