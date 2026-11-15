# Portfolio 1 — Database Design and Modelling

I organised the data into customer, account, payee, debit_payment, ledger_entry. The design document explains the fields, keys, relationships and business rules. The normalisation document shows the sample tables at 1NF, 2NF and 3NF.

## Database checks

| Table | Rows |
| --- | --- |
| customer | 1 |
| account | 1 |
| payee | 1 |
| debit_payment | 2 |
| ledger_entry | 1 |

The 16 invalid inserts were rejected at their expected constraints, and the valid sample rows remained unchanged.

## Files

- [Design](Oyeniyi_Oluwaseun_301932126_P1_Design.md)
- [ER diagram](Oyeniyi_Oluwaseun_301932126_P1_ERDiagram.md)
- [Normalisation](Oyeniyi_Oluwaseun_301932126_P1_Normalisation.md)
- [Schema](Oyeniyi_Oluwaseun_301932126_P1_Schema.sql)
- [Sample data](Oyeniyi_Oluwaseun_301932126_P1_SampleData.sql)
- [Constraint tests](Oyeniyi_Oluwaseun_301932126_P1_ConstraintTests.sql)
- [Table and constraint evidence](screenshots/Oyeniyi_Oluwaseun_301932126_P1_DatabaseResults.png)

## Run the SQL

Create a fresh PostgreSQL database. Run the schema first, then the sample data. Run the deliberately invalid statements in ConstraintTests.sql individually outside a transaction; each is expected to produce an error.

## References

- [PostgreSQL — constraints](https://www.postgresql.org/docs/17/ddl-constraints.html)

