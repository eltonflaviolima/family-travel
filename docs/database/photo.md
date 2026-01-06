# 📸 Tabela: Photos

Fotos enviadas por usuários relacionadas a atrações.

---

## 🧱 Estrutura

| Campo        | Tipo            | Regras         |
|--------------|-----------------|----------------|
| id           | UUID            | PK             |
| user         | FK (User)       | obrigatório    |
| attraction   | FK (Attraction) | obrigatório    |
| url          | varchar(300)    | obrigatório    |
| created_at   | datetime        | auto_now_add   |
