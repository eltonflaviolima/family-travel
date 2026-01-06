# 🏛 Arquitetura Geral – Family Travel

Este documento descreve a arquitetura geral do projeto **Family Travel**, que reúne backend em Django + Django REST Framework, app mobile em React Native + Expo e um banco PostgreSQL.

---

## 🔧 Componentes Principais

### **Backend**
- Framework: Django + DRF
- Autenticação: SimpleJWT
- Banco: PostgreSQL
- Upload de fotos: Django Storage (fs local no MVP)
- Apps principais:
  - `users`
  - `itinerary` (dias, atrações, dicas)
  - `checklist`
  - `photos`

---

## 📱 Mobile
- Framework: React Native (Expo)
- Navegação: React Navigation
- Estado: Context API (ou Redux futuramente)
- Comunicação com API: axios + interceptors JWT

---

## 🗄 Banco de Dados – Visão Macro

```
User (1) —— (N) Checklist —— (N) Attraction
User (1) —— (N) Photo —— (1) Attraction
City (1) —— (N) Day —— (N) Attraction
```
---

## 🗂 Estrutura das Pastas

### Backend
```
backend/
├─ manage.py
├─ core/
├─ users/
├─ itinerary/
├─ checklist/
├─ photos/
```
### Mobile
```
mobile/
├─ App.js
├─ src/
├─ api/
├─ screens/
├─ components/
├─ context/
├─ hooks/
```


---

## 🔐 Autenticação

- Login retorna **access** + **refresh**
- Rota `/auth/me/` retorna usuário logado
- Mobile mantém token no `AsyncStorage`

---

## 🚀 Fluxo Principal do Aplicativo

1. Usuário abre app  
2. Login  
3. Timeline da viagem  
4. Seleciona um dia  
5. Lista de atrações  
6. Abre detalhes  
7. Marca visitado / faz notas / envia fotos  

---

## 📸 Uploads de Fotos

- Cada foto pertence a **um usuário** e **uma atração**
- Tamanho máximo: 5MB
- Suporte a miniatura (futuro)

---

## 📝 Checklist

- Cada usuário mantém seu progresso
- Campo `visited` e campo `notes`

---

## 📌 Diagramas

Adicione seus diagramas na pasta:

```
/docs/diagrams/
```

e referencie assim:

```md
![ER Model](../diagrams/er-model.png)
