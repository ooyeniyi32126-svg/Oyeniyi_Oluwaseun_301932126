# MIT 8103 Payee Direct-Debit Tracker — normalisation

The example uses the saved sample records. The full set of fields is in the design and schema.

## Starting grouped records

| customer_id | account records (list) |
| --- | --- |
| 1 | [2] |


The record IDs are grouped in a list. In 1NF, each record has its own row and each cell holds one value.

## 1NF: one value per cell

| account.account_id | account.customer_id | account.account_number | customer.customer_id | customer.display_name |
| --- | --- | --- | --- | --- |
| 2 | 1 | ACCT-1001 | 1 | Avery Chen |

Key: account_id.

## 2NF: depend on the whole key

The declared candidate keys do not introduce a partial dependency here, so the 1NF rows stay unchanged at this step.

## account_example

| account.account_id | account.customer_id | account.account_number | customer.customer_id | customer.display_name |
| --- | --- | --- | --- | --- |
| 2 | 1 | ACCT-1001 | 1 | Avery Chen |

## 3NF: store each entity’s details once

The entity keys determine their own descriptions. Related records keep foreign keys rather than repeating those descriptions.

## customer

| customer_id | display_name | email | created_at |
| --- | --- | --- | --- |
| 1 | Avery Chen | avery.chen@example.test | 2026-01-10T09:00:00+00:00 |

## account

| account_id | customer_id | account_number | opened_on | active |
| --- | --- | --- | --- | --- |
| 2 | 1 | ACCT-1001 | 2026-01-12 | true |

## payee

| payee_id | display_name | payee_code | category |
| --- | --- | --- | --- |
| 3 | Northstar Utilities | PAY-UTIL-01 | utilities |

## debit_payment

| payment_id | account_id | payee_id | amount | paid_at | request_key |
| --- | --- | --- | --- | --- | --- |
| 4 | 2 | 3 | 82.5 | 2026-02-05T14:30:00+00:00 | req-2026-0001 |
| 6 | 2 | 3 | 41.25 | 2026-02-12T10:15:00+00:00 | req-2026-0002 |

## ledger_entry

| ledger_entry_id | payment_id | posted_at | entry_type |
| --- | --- | --- | --- |
| 5 | 4 | 2026-02-05T14:31:00+00:00 | debit |

## Dependencies

- customer: (customer_id) → display_name, email, created_at
- account: (account_id) → customer_id, account_number, opened_on, active
- payee: (payee_id) → display_name, payee_code, category
- debit_payment: (payment_id) → account_id, payee_id, amount, paid_at, request_key
- ledger_entry: (ledger_entry_id) → payment_id, posted_at, entry_type

Joining the decomposed sample tables reproduces the original 1 example rows. The design assumes the declared keys describe the relevant business dependencies.
