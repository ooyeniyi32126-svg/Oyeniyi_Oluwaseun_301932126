-- Show related debit_payment, ledger_entry records (up to 20).
SELECT t0."payment_id" AS "debit_payment_payment_id",
       t0."amount" AS "debit_payment_amount",
       t1."ledger_entry_id" AS "ledger_entry_ledger_entry_id",
       t1."posted_at" AS "ledger_entry_posted_at"
FROM portfolio."debit_payment" t0
JOIN portfolio."ledger_entry" t1 ON t1."payment_id" = t0."payment_id"
ORDER BY t0."payment_id", t1."ledger_entry_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT t0."payment_id" AS "debit_payment_payment_id",
       t0."amount" AS "debit_payment_amount",
       t1."ledger_entry_id" AS "ledger_entry_ledger_entry_id",
       t1."posted_at" AS "ledger_entry_posted_at"
FROM portfolio."debit_payment" t0
JOIN portfolio."ledger_entry" t1 ON t1."payment_id" = t0."payment_id"
ORDER BY t0."payment_id", t1."ledger_entry_id"
LIMIT 20;

-- Find debit_payment records where paid_at matches "2026-02-05T14:30:00Z" (up to 20).
SELECT * FROM portfolio."debit_payment"
WHERE "paid_at" IS NOT DISTINCT FROM '2026-02-05T14:30:00Z'
ORDER BY "payment_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM portfolio."debit_payment"
WHERE "paid_at" IS NOT DISTINCT FROM '2026-02-05T14:30:00Z'
ORDER BY "payment_id"
LIMIT 20;

-- Count debit_payment records for each account_id (up to 20 groups).
SELECT "account_id", count(*) AS record_count
FROM portfolio."debit_payment"
GROUP BY "account_id"
ORDER BY record_count DESC, "account_id" NULLS LAST
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT "account_id", count(*) AS record_count
FROM portfolio."debit_payment"
GROUP BY "account_id"
ORDER BY record_count DESC, "account_id" NULLS LAST
LIMIT 20;
