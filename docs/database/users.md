# 👤 Tabela: Users

Representa os usuários que utilizam o app Family Travel.

---

## 🧱 Estrutura

| Campo       | Tipo           | Regras                         | Descrição |
|-------------|----------------|--------------------------------|-----------|
| id          | UUID           | PK                             | Identificador |
| name        | varchar(100)   | obrigatório                    | Nome do usuário |
| email       | varchar(200)   | obrigatório, único             | Login |
| password    | hash           | obrigatório                    | Senha |
| photo_url   | varchar(300)   | opcional                       | Foto |
| created_at  | datetime       | auto_now_add                   | Criado em |
| updated_at  | datetime       | auto_now                       | Atualizado em |

---

## 🔗 Relacionamentos

- `User` (1) → (N) `Checklist`
- `User` (1) → (N) `Photo`

---

## 📝 Notas

- A senha deve sempre ser armazenada com `make_password`.