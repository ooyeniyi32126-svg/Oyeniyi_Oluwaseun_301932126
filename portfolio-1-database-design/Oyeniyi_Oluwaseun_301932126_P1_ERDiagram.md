# MIT 8103 Payee Direct-Debit Tracker — ER diagram

```mermaid
erDiagram
    direction LR
    customer {
        bigint customer_id PK
        text display_name
        text email UK
        timestamptz created_at
    }
    account {
        bigint account_id PK
        bigint customer_id FK
        text account_number UK
        date opened_on
        boolean active
    }
    payee {
        bigint payee_id PK
        text display_name
        text payee_code UK
        text category
    }
    debit_payment {
        bigint payment_id PK
        bigint account_id FK
        bigint payee_id FK
        numeric amount
        timestamptz paid_at
        text request_key UK
    }
    ledger_entry {
        bigint ledger_entry_id PK
        bigint payment_id FK,UK
        timestamptz posted_at
        text entry_type
    }
    customer ||--o{ account : "customer_id"
    account ||--o{ debit_payment : "account_id"
    payee ||--o{ debit_payment : "payee_id"
    debit_payment ||--o| ledger_entry : "payment_id"
```

PK identifies a record; FK links to another table; UK marks a single-field unique value. The relationship ends show exactly one, zero or one, or zero or many records. Composite unique keys and conditional rules are listed in the schema and design.

[Diagram image](../images/Oyeniyi_Oluwaseun_301932126_ERDiagram.png)
