# Sample Google Sheet Structure

This is the expected column layout for your Google Sheet.

## Column Layout

| Column | Header | Description | Filled by |
|--------|--------|-------------|-----------|
| A | Email | Recipient email addresses | You |
| B | Status | Send status ("Sent" or "Error: ...") | Script (auto) |
| C | Date Sent | Timestamp of when email was sent | Script (auto) |

## Example

| A (Email) | B (Status) | C (Date Sent) |
|-----------|------------|---------------|
| Email | Status | Date Sent |
| someone@gmail.com | Sent | 08/06/2026 10:14:32 |
| recruiter@company.com | Sent | 08/06/2026 10:14:34 |
| contact@startup.io | | |
| hr@enterprise.com | | |

## Notes

- Row 1 = header row (set `START_ROW = 2` in the script)
- Column A = email addresses only, one per row
- Column B and C = leave blank before first run; script fills them automatically
- Do not put any important data in columns B or C — the script overwrites them
- To re-send to someone, clear their "Sent" status from column B
