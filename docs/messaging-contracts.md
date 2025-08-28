# Messaging Contracts

## Topics
- metadata.assets.v1: Asset discovery/updates from connectors
- metadata.lineage.v1: Lineage edges and transformations
- governance.events.v1: Policy and audit-related events

## Payloads

### metadata.assets.v1
```json
{
  "assetId": "string",
  "assetType": "TABLE|VIEW|COLUMN|REPORT",
  "name": "string",
  "namespace": "string",
  "sourceSystem": "string",
  "schema": {
    "columns": [
      { "name": "string", "dataType": "string", "classification": "optional string" }
    ]
  },
  "owners": ["userId"],
  "updatedAt": "ISO-8601"
}
```

### metadata.lineage.v1
```json
{
  "upstream": { "assetId": "string", "column": "optional string" },
  "downstream": { "assetId": "string", "column": "optional string" },
  "transformation": {
    "type": "SQL|ETL|OTHER",
    "expression": "string"
  },
  "version": "string",
  "observedAt": "ISO-8601"
}
```

### governance.events.v1
```json
{
  "eventType": "ACCESS_GRANTED|ACCESS_REVOKED|MASK_APPLIED|TAG_ADDED|TAG_REMOVED",
  "actorUserId": "string",
  "entity": { "type": "ASSET|COLUMN|USER|ROLE", "id": "string" },
  "metadata": { "any": "json" },
  "occurredAt": "ISO-8601"
}
```

## Key Contracts Notes
- All events must be idempotent; include stable identifiers and versions
- Use snake_case for Kafka keys, camelCase for JSON fields
- Compression enabled on topics; retention 7-30 days depending on topic 