# Personal integrations and adapter contract

Inner Circle supplies presentation. Channels, scheduling, calls and transcripts
stay with Hermes and the services the owner chooses. The preset does not send,
sync, record calls, ingest transcripts, create schedules or connect an account.

## Why my setup has extra pieces

- **Telegram sync:** lets me continue the same bot conversation away from the
  desktop. Admission records identify incoming Telegram messages; actual delivery
  receipts distinguish a delivered reply from one merely prepared in the app.
- **Calls and transcripts through Conduit:** brings call context into the
  assistant's existing workflow so follow-ups can use what was discussed.
  Installation, account access, consent, routing and retention depend on the
  person's Conduit/calling setup; none of that is installed here.
- **Routine records:** keep useful scheduled check-ins visible without filling
  the conversation with automation bookkeeping. Their details are closed until
  opened; a prepared result is not a delivery receipt.

These integrations are excluded because they contain setup-specific routing and
depend on external services and private data, not because channel names need to
be hardcoded in the UI. Want help setting something similar up? [Open an
issue](https://github.com/PetarKing/hermes-inner-circle/issues/new). Describe
the workflow and versions, without credentials or private transcripts. I can
share pointers when available, with no support or delivery commitment.

## Native activity

The selected local Bot Chat's `session.history` can supply:

- `display_kind: async_delegation_complete` or `process_complete` for completed
  worker/process notices.
- `display_metadata.context_record: true` and the explicit
  `internal_routine_result` record format used in the personal setup. Other
  scheduler formats need an adapter; arbitrary prose is never treated as a job.

The adapter has no effect when the source metadata is absent. It never changes
the stored message or the model's context.

## Generic evidence fields

A history row has `role`, exact `text`, optional `row_id`/`timestamp`, and
`display_metadata.inner_circle`:

```json
{
  "origin": {"channel": "Telegram", "evidence": "native_admission"},
  "delivery": {"channel": "Telegram", "status": "delivered", "evidence": "platform_ack"},
  "activity": {"title": "Morning check-in", "status": "Prepared", "text": "Result text", "reason": "Why this ran"}
}
```

Every field is optional. Origin is rendered on human messages; delivery is
rendered on assistant messages (`delivered` or `failed` only). An adapter must
set `platform_ack` only from a real platform acknowledgement, never from the
assistant saying it sent something. Omit unknown/ambiguous evidence. Channel
names and activity text are inert text, not HTML. Activity status is descriptive;
the UI never treats it as proof of external delivery.

## Optional read-only snapshot inbox

For a custom producer, atomically write a bounded UTF-8 snapshot to
`<selected HERMES_HOME>/inner-circle/timeline.json`, outside the plugin checkout:

```json
{"schema_version":1,"sessions":[{
  "connection_id":"local","profile":"your-existing-profile",
  "session_id":"the-native-canonical-session-id",
  "rows":[{"id":"native-message-id","role":"assistant","text":"Exact visible reply",
    "display_metadata":{"inner_circle":{"delivery":{
      "channel":"Your channel","status":"delivered","evidence":"platform_ack"
    }}}}]
}]}
```

Enable the package backend, then use **Inner Circle: toggle configured timeline
adapter**. The endpoint is a fixed, read-only `/timeline` under the authenticated
plugin namespace. Query values select an exact source/profile/session record;
they never become file paths or SQL. Duplicate routes return no evidence. Only
the last 800 rows are returned, with a 4 MB snapshot limit. A missing file is an
empty result. Missing, malformed or inaccessible adapters leave messages intact.
Use the exact connection ID exposed by the native roster; don't assume `local`
for every installation. The backend reads the selected Hermes home's inbox;
test the owning profile/host scope before enabling it in a multi-host setup.

Visible duplicate text is deliberately not labelled or folded. This public
bridge currently matches unique role/text pairs within the verified selected
chat; row IDs are retained in the contract for a future native renderer hook.

## Connecting the personal adapter

The private Sebastian reader is not shipped. A coding agent can translate its
verified origin, delivery and routine records into this schema, retaining its
existing source checks and acknowledgement semantics. Conduit integration
should similarly use native attribution and stable call/transcript references,
not publish raw recordings or invent source labels from quoted message text.
Choose retention and consent with the owner before enabling ingestion.
