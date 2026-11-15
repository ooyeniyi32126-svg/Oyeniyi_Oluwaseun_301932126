# Portfolio 4 — NoSQL and Advanced Data Models

I used MongoDB collection debit_payment_events for payment_recorded and payment_failed events. These are fictional event examples based on debit_payment, account, customer.

## Document model

| Field | Meaning |
| --- | --- |
| _id | Unique string event ID |
| eventType | One of the two selected case event labels |
| occurredAt | Native BSON Date; sample timestamps are in 2030 |
| source | Original entity, primary key and saved JSON snapshot |
| embedded | Linked record snapshots read with the event |
| references | Keys for linked sources kept outside the embedded snapshots |
| details | Event metadata whose fields vary |

Related account, customer details are stored as snapshots with the event. This makes an event readable in one document. It duplicates some information, and later SQL changes do not automatically update the snapshots. PostgreSQL continues to enforce the relational rules.

## Example document

```javascript
{
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "payment_recorded",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "debit_payment",
        "key": {
            "payment_id": 4
        },
        "snapshot": {
            "payment_id": 4,
            "account_id": 2,
            "payee_id": 3,
            "amount": 82.5,
            "paid_at": "2026-02-05T14:30:00Z",
            "request_key": "req-2026-0001"
        }
    },
    "embedded": {
        "account": [
            {
                "key": {
                    "account_id": 2
                },
                "snapshot": {
                    "account_id": 2,
                    "customer_id": 1,
                    "account_number": "ACCT-1001",
                    "opened_on": "2026-01-12",
                    "active": true
                },
                "via": [
                    "debit_payment.account_id → account"
                ]
            }
        ],
        "customer": [
            {
                "key": {
                    "customer_id": 1
                },
                "snapshot": {
                    "customer_id": 1,
                    "display_name": "Avery Chen",
                    "email": "avery.chen@example.test",
                    "created_at": "2026-01-10T09:00:00Z"
                },
                "via": [
                    "debit_payment.account_id → account.customer_id → customer"
                ]
            }
        ]
    },
    "references": {},
    "details": {
        "channel": "web"
    }
}
```

## Queries and results

| Query | Returned documents |
| --- | --- |
| Find the first sample event type (up to five documents). | 2 |
| Find events for the first source record using nested key fields (up to five). | 2 |
| Find events in the sample time range using a MongoDB Date filter (up to five). | 4 |
| Count documents for each event type. | 2 |

## 1. Find the first sample event type (up to five documents).

```javascript
db.getCollection("debit_payment_events").find({"eventType":"payment_recorded"}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "payment_recorded",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "payment_id": 4
    }
  },
  {
    "_id": "event_000003",
    "eventType": "payment_recorded",
    "occurredAt": {
      "$date": "2030-01-01T10:02:00Z"
    },
    "source": {
      "payment_id": 6
    }
  }
]
```

## 2. Find events for the first source record using nested key fields (up to five).

```javascript
db.getCollection("debit_payment_events").find({"source.key.payment_id":4}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "payment_recorded",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "payment_id": 4
    }
  },
  {
    "_id": "event_000002",
    "eventType": "payment_failed",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "payment_id": 4
    }
  }
]
```

## 3. Find events in the sample time range using a MongoDB Date filter (up to five).

```javascript
db.getCollection("debit_payment_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "payment_recorded",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "payment_id": 4
    }
  },
  {
    "_id": "event_000002",
    "eventType": "payment_failed",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "payment_id": 4
    }
  },
  {
    "_id": "event_000003",
    "eventType": "payment_recorded",
    "occurredAt": {
      "$date": "2030-01-01T10:02:00Z"
    },
    "source": {
      "payment_id": 6
    }
  },
  {
    "_id": "event_000004",
    "eventType": "payment_failed",
    "occurredAt": {
      "$date": "2030-01-01T10:03:00Z"
    },
    "source": {
      "payment_id": 6
    }
  }
]
```

## 4. Count documents for each event type.

```javascript
db.getCollection("debit_payment_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray();
```

| _id | documentCount |
| --- | --- |
| payment_failed | 2 |
| payment_recorded | 2 |

## Validation and suitability

MongoDB inserted 4 documents. An invalid date type was rejected with code 121 and a repeated event ID with 11000. The collection still contained 4 valid documents. The compound eventType/occurredAt index supports those access fields; this exercise does not measure its speed.

The details field can vary across event types, while the common fields have a validator. Events can be added as separate documents rather than growing one large history record.

## Run the script

Connect mongosh to a fresh exercise database and run Oyeniyi_Oluwaseun_301932126_P4_MongoDB.js. It selects portfolio_nosql, creates the collection, inserts the sample documents and displays the query results. [Implementation evidence](screenshots/Oyeniyi_Oluwaseun_301932126_P4_DocumentsAndQueries.png).

## References

- [MongoDB — data modelling](https://www.mongodb.com/docs/manual/data-modeling/)

