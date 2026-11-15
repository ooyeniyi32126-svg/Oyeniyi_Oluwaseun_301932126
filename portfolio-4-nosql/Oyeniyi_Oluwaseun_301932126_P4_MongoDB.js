// Run once in mongosh against a fresh exercise database.
// These records are fictional events for the case study.
(async function () {
  db = db.getSiblingDB('portfolio_nosql');
  if ((await db.getCollectionNames()).includes("debit_payment_events")) {
    throw new Error('The exercise collection already exists. Use a fresh database.');
  }

  // The validator checks the stable event fields while details can vary.
  await db.createCollection("debit_payment_events", {
    validator: {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "_id",
            "schemaVersion",
            "simulation",
            "eventType",
            "occurredAt",
            "source",
            "embedded",
            "references",
            "details"
        ],
        "properties": {
            "_id": {
                "bsonType": "string",
                "minLength": 1
            },
            "schemaVersion": {
                "enum": [
                    1
                ]
            },
            "simulation": {
                "enum": [
                    true
                ]
            },
            "eventType": {
                "bsonType": "string",
                "enum": [
                    "payment_recorded",
                    "payment_failed"
                ]
            },
            "occurredAt": {
                "bsonType": "date"
            },
            "source": {
                "bsonType": "object",
                "required": [
                    "entity",
                    "key",
                    "snapshot"
                ],
                "properties": {
                    "entity": {
                        "enum": [
                            "debit_payment"
                        ]
                    },
                    "key": {
                        "bsonType": "object",
                        "required": [
                            "payment_id"
                        ]
                    },
                    "snapshot": {
                        "bsonType": "object"
                    }
                }
            },
            "embedded": {
                "bsonType": "object"
            },
            "references": {
                "bsonType": "object"
            },
            "details": {
                "bsonType": "object"
            }
        }
    }
},
    validationLevel: 'strict', validationAction: 'error'
  });

  // Insert the four example events and show their IDs.
  printjson(await db.getCollection("debit_payment_events").insertMany([
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
    },
    {
        "_id": "event_000002",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "payment_failed",
        "occurredAt": ISODate("2030-01-01T10:01:00Z"),
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
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "examples": {
                "failure_reason": "illustrative failure_reason",
                "context_metadata": "illustrative context_metadata"
            }
        }
    },
    {
        "_id": "event_000003",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "payment_recorded",
        "occurredAt": ISODate("2030-01-01T10:02:00Z"),
        "source": {
            "entity": "debit_payment",
            "key": {
                "payment_id": 6
            },
            "snapshot": {
                "payment_id": 6,
                "account_id": 2,
                "payee_id": 3,
                "amount": 41.25,
                "paid_at": "2026-02-12T10:15:00Z",
                "request_key": "req-2026-0002"
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
    },
    {
        "_id": "event_000004",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "payment_failed",
        "occurredAt": ISODate("2030-01-01T10:03:00Z"),
        "source": {
            "entity": "debit_payment",
            "key": {
                "payment_id": 6
            },
            "snapshot": {
                "payment_id": 6,
                "account_id": 2,
                "payee_id": 3,
                "amount": 41.25,
                "paid_at": "2026-02-12T10:15:00Z",
                "request_key": "req-2026-0002"
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
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "examples": {
                "failure_reason": "illustrative failure_reason",
                "context_metadata": "illustrative context_metadata"
            }
        }
    }
]));
  await db.getCollection("debit_payment_events").createIndex({eventType: 1, occurredAt: -1}, {name: 'event_type_time'});

  // 1. Find the first sample event type (up to five documents).
  printjson(await db.getCollection("debit_payment_events").find({"eventType":"payment_recorded"}).sort({_id:1}).limit(5).toArray());

  // 2. Find events for the first source record using nested key fields (up to five).
  printjson(await db.getCollection("debit_payment_events").find({"source.key.payment_id":4}).sort({_id:1}).limit(5).toArray());

  // 3. Find events in the sample time range using a MongoDB Date filter (up to five).
  printjson(await db.getCollection("debit_payment_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray());

  // 4. Count documents for each event type.
  printjson(await db.getCollection("debit_payment_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray());

  // A date stored as text should be rejected by the validator.
  try {
    await db.getCollection("debit_payment_events").insertOne({...{
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
}, _id: 'invalid_date_example', occurredAt: 'not-a-date'});
  } catch (error) { print('Invalid date error: ' + error.code); }

  // Reusing an event ID should be rejected by the unique _id index.
  try { await db.getCollection("debit_payment_events").insertOne({
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
}); }
  catch (error) { print('Duplicate ID error: ' + error.code); }

  print('Document count: ' + await db.getCollection("debit_payment_events").countDocuments());
})().catch(error => { print(error.stack || String(error)); quit(1); });
