-- MIT 8103 Payee Direct-Debit Tracker: tables, keys and business constraints.
-- Run once in a fresh PostgreSQL database.
BEGIN;
SET LOCAL standard_conforming_strings = on;
CREATE SCHEMA portfolio;
CREATE TABLE portfolio."customer" (
  "customer_id" bigint NOT NULL,
  "display_name" text NOT NULL,
  "email" text NOT NULL,
  "created_at" timestamptz NOT NULL,
  CONSTRAINT "pk_customer" PRIMARY KEY ("customer_id"),
  CONSTRAINT "uq_customer_0" UNIQUE ("email")
);
CREATE TABLE portfolio."account" (
  "account_id" bigint NOT NULL,
  "customer_id" bigint NOT NULL,
  "account_number" text NOT NULL,
  "opened_on" date NOT NULL,
  "active" boolean NOT NULL,
  CONSTRAINT "pk_account" PRIMARY KEY ("account_id"),
  CONSTRAINT "uq_account_0" UNIQUE ("account_number")
);
CREATE TABLE portfolio."payee" (
  "payee_id" bigint NOT NULL,
  "display_name" text NOT NULL,
  "payee_code" text NOT NULL,
  "category" text NOT NULL,
  CONSTRAINT "pk_payee" PRIMARY KEY ("payee_id"),
  CONSTRAINT "uq_payee_0" UNIQUE ("payee_code")
);
CREATE TABLE portfolio."debit_payment" (
  "payment_id" bigint NOT NULL,
  "account_id" bigint NOT NULL,
  "payee_id" bigint NOT NULL,
  "amount" numeric(18,2) NOT NULL,
  "paid_at" timestamptz NOT NULL,
  "request_key" text NOT NULL,
  CONSTRAINT "pk_debit_payment" PRIMARY KEY ("payment_id"),
  CONSTRAINT "uq_debit_payment_0" UNIQUE ("request_key")
);
CREATE TABLE portfolio."ledger_entry" (
  "ledger_entry_id" bigint NOT NULL,
  "payment_id" bigint NOT NULL,
  "posted_at" timestamptz NOT NULL,
  "entry_type" text NOT NULL,
  CONSTRAINT "pk_ledger_entry" PRIMARY KEY ("ledger_entry_id"),
  CONSTRAINT "uq_ledger_entry_0" UNIQUE ("payment_id")
);
ALTER TABLE portfolio."account" ADD CONSTRAINT "fk_account_0" FOREIGN KEY ("customer_id") REFERENCES portfolio."customer" ("customer_id");
ALTER TABLE portfolio."debit_payment" ADD CONSTRAINT "fk_debit_payment_0" FOREIGN KEY ("account_id") REFERENCES portfolio."account" ("account_id");
ALTER TABLE portfolio."debit_payment" ADD CONSTRAINT "fk_debit_payment_1" FOREIGN KEY ("payee_id") REFERENCES portfolio."payee" ("payee_id");
ALTER TABLE portfolio."ledger_entry" ADD CONSTRAINT "fk_ledger_entry_0" FOREIGN KEY ("payment_id") REFERENCES portfolio."debit_payment" ("payment_id");
ALTER TABLE portfolio."debit_payment" ADD CONSTRAINT "payment_amount_positive" CHECK ("amount" > 0);
COMMIT;
