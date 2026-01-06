# 🔐 API – Autenticação

## POST /api/auth/login/
Retorna access + refresh.

### Body:
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```
## GET /api/auth/me/

Retorna o usuário autenticado.