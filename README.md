# Oluwaseun Oyeniyi — MIT 8103

Student ID: 301932126

Payee Direct-Debit Tracker. Entities: Customer, Account (belongs to Customer), Payee and DebitPayment (references Account and Payee). Rule: payment amount must be positive (CHECK). Query: monthly debit totals by payee. Transaction: insert a payment and its ledger entry atomically. MongoDB event logs: snapshot the payment with its account and customer details.

The portfolio is being generated. Completed stages will appear in the commit history.
