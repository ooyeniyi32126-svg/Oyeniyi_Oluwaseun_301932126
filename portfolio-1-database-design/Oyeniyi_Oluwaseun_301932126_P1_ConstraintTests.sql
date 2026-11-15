-- Run these deliberately invalid statements one at a time, outside a transaction.
-- Each should fail at the named constraint; the sample rows should remain unchanged.

-- 1. customer pk duplicate. Expected: pk_customer, SQLSTATE 23505.
INSERT INTO portfolio."customer" ("customer_id", "display_name", "email", "created_at")
VALUES (1, 'Duplicate ID Customer', 'duplicate.pk.customer@example.test', '2026-03-01T09:00:00Z');

-- 2. customer email duplicate. Expected: uq_customer_0, SQLSTATE 23505.
INSERT INTO portfolio."customer" ("customer_id", "display_name", "email", "created_at")
VALUES (101, 'Duplicate Email Customer', 'avery.chen@example.test', '2026-03-01T09:05:00Z');

-- 3. customer display name null. Expected: display_name, SQLSTATE 23502.
INSERT INTO portfolio."customer" ("customer_id", "display_name", "email", "created_at")
VALUES (111, NULL, 'null.name.customer@example.test', '2026-03-01T09:10:00Z');

-- 4. account pk duplicate. Expected: pk_account, SQLSTATE 23505.
INSERT INTO portfolio."account" ("account_id", "customer_id", "account_number", "opened_on", "active")
VALUES (2, 1, 'ACCT-PK-TEST', '2026-03-02', TRUE);

-- 5. account number duplicate. Expected: uq_account_0, SQLSTATE 23505.
INSERT INTO portfolio."account" ("account_id", "customer_id", "account_number", "opened_on", "active")
VALUES (102, 1, 'ACCT-1001', '2026-03-02', TRUE);

-- 6. account customer missing. Expected: fk_account_0, SQLSTATE 23503.
INSERT INTO portfolio."account" ("account_id", "customer_id", "account_number", "opened_on", "active")
VALUES (103, 901, 'ACCT-FK-TEST', '2026-03-03', TRUE);

-- 7. payee pk duplicate. Expected: pk_payee, SQLSTATE 23505.
INSERT INTO portfolio."payee" ("payee_id", "display_name", "payee_code", "category")
VALUES (3, 'Duplicate ID Payee', 'PAY-PK-TEST', 'services');

-- 8. payee code duplicate. Expected: uq_payee_0, SQLSTATE 23505.
INSERT INTO portfolio."payee" ("payee_id", "display_name", "payee_code", "category")
VALUES (104, 'Duplicate Code Payee', 'PAY-UTIL-01', 'services');

-- 9. payment pk duplicate. Expected: pk_debit_payment, SQLSTATE 23505.
INSERT INTO portfolio."debit_payment" ("payment_id", "account_id", "payee_id", "amount", "paid_at", "request_key")
VALUES (4, 2, 3, 10, '2026-03-04T11:00:00Z', 'req-pk-test');

-- 10. payment request duplicate. Expected: uq_debit_payment_0, SQLSTATE 23505.
INSERT INTO portfolio."debit_payment" ("payment_id", "account_id", "payee_id", "amount", "paid_at", "request_key")
VALUES (105, 2, 3, 10, '2026-03-04T11:05:00Z', 'req-2026-0001');

-- 11. payment account missing. Expected: fk_debit_payment_0, SQLSTATE 23503.
INSERT INTO portfolio."debit_payment" ("payment_id", "account_id", "payee_id", "amount", "paid_at", "request_key")
VALUES (106, 902, 3, 10, '2026-03-04T11:10:00Z', 'req-fk-account-test');

-- 12. payment payee missing. Expected: fk_debit_payment_1, SQLSTATE 23503.
INSERT INTO portfolio."debit_payment" ("payment_id", "account_id", "payee_id", "amount", "paid_at", "request_key")
VALUES (107, 2, 903, 10, '2026-03-04T11:15:00Z', 'req-fk-payee-test');

-- 13. payment amount not positive. Expected: payment_amount_positive, SQLSTATE 23514.
INSERT INTO portfolio."debit_payment" ("payment_id", "account_id", "payee_id", "amount", "paid_at", "request_key")
VALUES (110, 2, 3, 0, '2026-03-04T11:20:00Z', 'req-check-test');

-- 14. ledger pk duplicate. Expected: pk_ledger_entry, SQLSTATE 23505.
INSERT INTO portfolio."ledger_entry" ("ledger_entry_id", "payment_id", "posted_at", "entry_type")
VALUES (5, 6, '2026-03-05T12:00:00Z', 'debit');

-- 15. ledger payment duplicate. Expected: uq_ledger_entry_0, SQLSTATE 23505.
INSERT INTO portfolio."ledger_entry" ("ledger_entry_id", "payment_id", "posted_at", "entry_type")
VALUES (108, 4, '2026-03-05T12:05:00Z', 'debit');

-- 16. ledger payment missing. Expected: fk_ledger_entry_0, SQLSTATE 23503.
INSERT INTO portfolio."ledger_entry" ("ledger_entry_id", "payment_id", "posted_at", "entry_type")
VALUES (109, 904, '2026-03-05T12:10:00Z', 'debit');
