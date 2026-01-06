# 🏙 Tabela: Cities

Representa as cidades visitadas na viagem.

---

## 🧱 Estrutura

| Campo        | Tipo          | Regras           |
|--------------|---------------|------------------|
| id           | UUID          | PK               |
| name         | varchar(100)  | obrigatório      |
| country      | varchar(100)  | obrigatório      |
| order        | integer       | obrigatório      |

---

## 🔗 Relacionamentos
- `City` (1) → (N) `Day`
