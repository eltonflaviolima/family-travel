# 🎡 Tabela: Attractions

Representa as atrações de cada dia da viagem.

---

## 🧱 Estrutura

| Campo        | Tipo            | Regras                  |
|--------------|-----------------|-------------------------|
| id           | UUID            | PK                      |
| day_id       | FK (Day)        | obrigatório             |
| name         | varchar(200)    | obrigatório             |
| address      | varchar(300)    | opcional                |
| time         | time            | opcional                |
| description  | text            | opcional                |

---

## 🔗 Relacionamentos

- `Attraction` (1) → (N) `Checklist`
- `Attraction` (1) → (N) `Photo`
- `Attraction` (1) → (N) `AttractionTip`
