

## Fix Ticket Comment Webhook Authentication

### Problem
The "Ticket Comment" webhook (`28132417-b3d1-4a08-a8d9-5666cc8cad9e`) was created without authentication settings. It has `authentication_type = 'none'` and an empty `authentication_config`, so no Bearer token is sent with requests. Paisaa Saarthi's endpoint requires the token `7vN$F9#2xP&z@qL1`, resulting in all 3 logged attempts failing with HTTP 401.

### Fix
Update the webhook's authentication settings via SQL:

```sql
UPDATE outbound_webhooks
SET authentication_type = 'bearer',
    authentication_config = '{"token": "7vN$F9#2xP&z@qL1"}'::jsonb
WHERE id = '28132417-b3d1-4a08-a8d9-5666cc8cad9e';
```

This is a single database update -- no code changes or edge function redeployment needed.

### Verification
After the fix, retry one of the failed comment deliveries from the UI to confirm it succeeds with HTTP 200.

