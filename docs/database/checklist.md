# ✔ Checklist

Marca o progresso do usuário nas atrações da viagem.

---

## 🧱 Estrutura

| Campo        | Tipo            | Regras                     |
|--------------|-----------------|----------------------------|
| id           | UUID            | PK                         |
| user         | FK (User)       | obrigatório                |
| attraction   | FK (Attraction) | obrigatório, unique-together |
| visited      | boolean         | default=false              |
| notes        | text            | opcional                   |

---

## 🔗 Relacionamentos

- Cada usuário tem seu checklist individual
