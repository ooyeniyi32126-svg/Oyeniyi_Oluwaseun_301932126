# MIT 8103 Payee Direct-Debit Tracker — database design

My case study records customer, account, payee, debit_payment, ledger_entry.

## Users

- Customers whose accounts fund debit payments
- Operations staff recording payments and ledger entries
- Analysts reviewing monthly debit totals by payee

## Main operations

- Record a debit payment and its ledger entry atomically.
- Retrieve monthly debit totals grouped by payee.
- Benchmark a paid_at date-range filter on 25,000 synthetic payments, comparing an unindexed copy with a copy using a B-tree index while keeping data and query constant.

## Entities

| Entity | Information stored |
| --- | --- |
| customer | Person or organization that owns one or more accounts. |
| account | Customer-owned account that can fund debit payments. |
| payee | Recipient identified in debit payment records. |
| debit_payment | Debit request linking one account to one payee. |
| ledger_entry | Posting record created atomically with its debit payment. |

## customer

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| customer_id | BIGINT | PK | Yes |
| display_name | TEXT |  | Yes |
| email | TEXT | Unique | Yes |
| created_at | TIMESTAMPTZ |  | Yes |
- Unique key: (email).

## account

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| account_id | BIGINT | PK | Yes |
| customer_id | BIGINT | FK | Yes |
| account_number | TEXT | Unique | Yes |
| opened_on | DATE |  | Yes |
| active | BOOLEAN |  | Yes |
- customer_id → customer.customer_id
- Unique key: (account_number).

## payee

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| payee_id | BIGINT | PK | Yes |
| display_name | TEXT |  | Yes |
| payee_code | TEXT | Unique | Yes |
| category | TEXT |  | Yes |
- Unique key: (payee_code).

## debit_payment

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| payment_id | BIGINT | PK | Yes |
| account_id | BIGINT | FK | Yes |
| payee_id | BIGINT | FK | Yes |
| amount | NUMERIC(18,2) |  | Yes |
| paid_at | TIMESTAMPTZ |  | Yes |
| request_key | TEXT | Unique | Yes |
- account_id → account.account_id
- payee_id → payee.payee_id
- Unique key: (request_key).

## ledger_entry

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| ledger_entry_id | BIGINT | PK | Yes |
| payment_id | BIGINT | FK, Unique | Yes |
| posted_at | TIMESTAMPTZ |  | Yes |
| entry_type | TEXT |  | Yes |
- payment_id → debit_payment.payment_id
- Unique key: (payment_id).

## Relationships and business rules

- Every debit payment amount must be greater than zero.
- A request key identifies at most one debit payment, preventing duplicate requests.
- At most one ledger entry may reference a debit payment.
- Each debit payment must reference an existing account.
- Each debit payment must reference an existing payee.
- Each ledger entry must reference an existing debit payment.

## Assumptions

- Amounts use USD; currency conversion is outside the exercise.
- Monthly reports use UTC calendar months and group payments by paid_at.
- A customer may own multiple accounts; each payment references one account and one payee.
- Primary-key values are allocated from one globally unique identifier space across all entities.
- A payment has at most one ledger entry; the ledger entry references its payment and does not duplicate its amount.
- The normalization example starts with account and follows its customer_id foreign key to customer; account facts and customer facts are stored separately.
- MongoDB events include successful payment records and failed payment attempts; failed attempts may include a failure reason and attempted amount.

