# MIT 8103 Payee Direct-Debit Tracker — SQL queries

## 1. Show related debit_payment, ledger_entry records (up to 20).

```sql
SELECT t0."payment_id" AS "debit_payment_payment_id",
       t0."amount" AS "debit_payment_amount",
       t1."ledger_entry_id" AS "ledger_entry_ledger_entry_id",
       t1."posted_at" AS "ledger_entry_posted_at"
FROM portfolio."debit_payment" t0
JOIN portfolio."ledger_entry" t1 ON t1."payment_id" = t0."payment_id"
ORDER BY t0."payment_id", t1."ledger_entry_id"
LIMIT 20;
```

| debit_payment_payment_id | debit_payment_amount | ledger_entry_ledger_entry_id | ledger_entry_posted_at |
| --- | --- | --- | --- |
| 4 | 82.5 | 5 | 2026-02-05T14:31:00+00:00 |

## 2. Find debit_payment records where paid_at matches "2026-02-05T14:30:00Z" (up to 20).

```sql
SELECT * FROM portfolio."debit_payment"
WHERE "paid_at" IS NOT DISTINCT FROM '2026-02-05T14:30:00Z'
ORDER BY "payment_id"
LIMIT 20;
```

| payment_id | account_id | payee_id | amount | paid_at | request_key |
| --- | --- | --- | --- | --- | --- |
| 4 | 2 | 3 | 82.5 | 2026-02-05T14:30:00+00:00 | req-2026-0001 |

## 3. Count debit_payment records for each account_id (up to 20 groups).

```sql
SELECT "account_id", count(*) AS record_count
FROM portfolio."debit_payment"
GROUP BY "account_id"
ORDER BY record_count DESC, "account_id" NULLS LAST
LIMIT 20;
```

| account_id | record_count |
| --- | --- |
| 2 | 2 |


## Index comparison

| Phase | Median (ms) | Three runs (ms) | Plan nodes | Buffer hits |
| --- | --- | --- | --- | --- |
| Before index | 1.322 | 1.66, 1.322, 1.208 | Sort → Seq Scan | 139 |
| After index | 0.21 | 0.21, 0.191, 0.222 | Sort → Bitmap Heap Scan → Bitmap Index Scan | 30 |

The median execution time changed from 1.322 ms to 0.21 ms. The measured plan used p2_filter_idx. The results matched in both phases. An index adds storage and write-maintenance costs; timings depend on the selected lookup and environment.

## Execution plans

### Before index, run 1

```text
Sort (actual time=1.625..1.627 rows=25 loops=1)
  Seq Scan on debit_payment (actual time=0.024..1.57 rows=25 loops=1)
Planning Time: 0.54 ms
Execution Time: 1.66 ms
```

### Before index, run 2

```text
Sort (actual time=1.292..1.294 rows=25 loops=1)
  Seq Scan on debit_payment (actual time=0.021..1.247 rows=25 loops=1)
Planning Time: 0.448 ms
Execution Time: 1.322 ms
```

### Before index, run 3

```text
Sort (actual time=1.179..1.181 rows=25 loops=1)
  Seq Scan on debit_payment (actual time=0.014..1.144 rows=25 loops=1)
Planning Time: 0.359 ms
Execution Time: 1.208 ms
```

### After index, run 1

```text
Sort (actual time=0.156..0.158 rows=25 loops=1)
  Bitmap Heap Scan on debit_payment (actual time=0.047..0.12 rows=25 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.021..0.022 rows=25 loops=1)
Planning Time: 0.547 ms
Execution Time: 0.21 ms
```

### After index, run 2

```text
Sort (actual time=0.137..0.139 rows=25 loops=1)
  Bitmap Heap Scan on debit_payment (actual time=0.027..0.102 rows=25 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.015..0.015 rows=25 loops=1)
Planning Time: 0.529 ms
Execution Time: 0.191 ms
```

### After index, run 3

```text
Sort (actual time=0.163..0.165 rows=25 loops=1)
  Bitmap Heap Scan on debit_payment (actual time=0.028..0.125 rows=25 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.015..0.015 rows=25 loops=1)
Planning Time: 0.558 ms
Execution Time: 0.222 ms
```

## Reproduce

Use a fresh database with the Portfolio 1 schema and sample data. Run Oyeniyi_Oluwaseun_301932126_P2_Queries.sql, then Oyeniyi_Oluwaseun_301932126_P2_Optimisation.sql. The optimisation script creates a separate performance table and runs EXPLAIN (ANALYZE, BUFFERS).

[Query screenshot](screenshots/Oyeniyi_Oluwaseun_301932126_P2_QueryResults.png) · [Index comparison](screenshots/Oyeniyi_Oluwaseun_301932126_P2_IndexComparison.png)

## References

- [PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/17/using-explain.html)

