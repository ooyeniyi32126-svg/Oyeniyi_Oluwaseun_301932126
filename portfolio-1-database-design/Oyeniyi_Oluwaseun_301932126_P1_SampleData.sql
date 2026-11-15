-- Fictional sample records for MIT 8103 Payee Direct-Debit Tracker.
BEGIN;
SET LOCAL standard_conforming_strings = on;
INSERT INTO portfolio."customer" ("customer_id", "display_name", "email", "created_at") VALUES (1, 'Avery Chen', 'avery.chen@example.test', '2026-01-10T09:00:00Z');
INSERT INTO portfolio."payee" ("payee_id", "display_name", "payee_code", "category") VALUES (3, 'Northstar Utilities', 'PAY-UTIL-01', 'utilities');
INSERT INTO portfolio."account" ("account_id", "customer_id", "account_number", "opened_on", "active") VALUES (2, 1, 'ACCT-1001', '2026-01-12', TRUE);
INSERT INTO portfolio."debit_payment" ("payment_id", "account_id", "payee_id", "amount", "paid_at", "request_key") VALUES (4, 2, 3, 82.5, '2026-02-05T14:30:00Z', 'req-2026-0001');
INSERT INTO portfolio."debit_payment" ("payment_id", "account_id", "payee_id", "amount", "paid_at", "request_key") VALUES (6, 2, 3, 41.25, '2026-02-12T10:15:00Z', 'req-2026-0002');
INSERT INTO portfolio."ledger_entry" ("ledger_entry_id", "payment_id", "posted_at", "entry_type") VALUES (5, 4, '2026-02-05T14:31:00Z', 'debit');
COMMIT;
