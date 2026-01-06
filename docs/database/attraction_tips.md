# 💡 Tabela: AttractionTips

Dicas práticas para aproveitar a atração.

---

## 🧱 Estrutura

| Campo      | Tipo            | Regras       |
|------------|-----------------|--------------|
| id         | UUID            | PK           |
| attraction | FK (Attraction) | obrigatório  |
| tip        | text            | obrigatório  |
