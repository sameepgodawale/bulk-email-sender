# 📧 Bulk Email Sender — Google Apps Script

A lightweight, free bulk email sender built on **Google Apps Script** that integrates directly with **Gmail** and **Google Sheets**. Send hundreds of personalized or identical emails with a file attachment — no third-party tools, no monthly subscriptions, no coding experience required beyond copy-paste.

Built by [Sameep Godawale](https://linkedin.com/in/sameepgodawale) as part of a job search outreach automation project.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup Guide](#setup-guide)
  - [Step 1 — Prepare your Google Sheet](#step-1--prepare-your-google-sheet)
  - [Step 2 — Upload your attachment to Google Drive](#step-2--upload-your-attachment-to-google-drive)
  - [Step 3 — Get your Google Drive File ID](#step-3--get-your-google-drive-file-id)
  - [Step 4 — Open Apps Script](#step-4--open-apps-script)
  - [Step 5 — Paste and configure the script](#step-5--paste-and-configure-the-script)
  - [Step 6 — Authorize the script](#step-6--authorize-the-script)
  - [Step 7 — Test run](#step-7--test-run)
  - [Step 8 — Schedule automatic sends](#step-8--schedule-automatic-sends)
- [Configuration Reference](#configuration-reference)
- [Gmail Sending Limits](#gmail-sending-limits)
- [How It Works](#how-it-works)
- [Tracking Sent Emails](#tracking-sent-emails)
- [Troubleshooting](#troubleshooting)
- [FAQs](#faqs)
- [License](#license)

---

## Overview

This project solves a simple problem: **sending the same email with an attachment to a large list of recipients**, without paying for a mail-merge SaaS tool and without hitting Gmail's daily limits.

It uses:
- **Google Sheets** as the contact list database
- **Google Drive** to store the attachment
- **Gmail** to send emails via your personal account
- **Google Apps Script** as the engine that ties it all together — running entirely inside Google's infrastructure, for free

---

## Features

- ✅ Send identical emails to hundreds of recipients
- ✅ Attach any file from Google Drive (PDF, DOCX, etc.)
- ✅ Automatically marks each row as **"Sent"** after sending
- ✅ Logs a **timestamp** for every sent email
- ✅ Skips already-sent rows on re-run — safe to run multiple times
- ✅ Logs errors per row without stopping the entire send
- ✅ Configurable daily send limit to stay within Gmail quota
- ✅ Schedule to run automatically at a set time every day
- ✅ No third-party tools, no API keys, no monthly cost
- ✅ Works entirely inside Google's ecosystem

---

## Prerequisites

Before you begin, make sure you have:

- A **Google account** (Gmail)
- A **Google Sheet** with a list of email addresses
- A file uploaded to **Google Drive** (your resume, brochure, document, etc.)
- Basic ability to copy-paste code

No programming knowledge required.

---

## Project Structure

```
bulk-email-sender/
├── Code.gs           # The main Apps Script — paste this into your project
├── README.md         # This file
└── sample-sheet.md   # Expected Google Sheet column structure
```

---

## Setup Guide

### Step 1 — Prepare your Google Sheet

Open or create a Google Sheet with the following column structure:

| Column A | Column B | Column C |
|----------|----------|----------|
| Email addresses | Status (auto-filled) | Timestamp (auto-filled) |
| someone@gmail.com | | |
| another@company.com | | |

- **Column A** — paste all your recipient email addresses here (one per row)
- **Row 1** — use as a header row (e.g. "Email", "Status", "Date Sent")
- **Column B and C** — leave blank; the script fills these automatically

> ⚠️ Do not put anything important in columns B or C — the script will overwrite them.

---

### Step 2 — Upload your attachment to Google Drive

1. Go to [drive.google.com](https://drive.google.com)
2. Click **+ New → File upload**
3. Upload your file (resume, PDF, document, etc.)
4. Wait for the upload to complete

---

### Step 3 — Get your Google Drive File ID

1. Right-click your uploaded file in Google Drive
2. Click **Share → Copy link**
3. Your link will look like this:
   ```
   https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/view
   ```
4. The **File ID** is the string between `/d/` and `/view`:
   ```
   1aBcDeFgHiJkLmNoPqRsTuVwXyZ
   ```
5. Copy and save this ID — you'll need it in the next step

---

### Step 4 — Open Apps Script

1. Open your Google Sheet
2. Click **Extensions** in the top menu
3. Click **Apps Script**
4. A new tab opens with the Apps Script editor
5. Delete any existing code in the editor

---

### Step 5 — Paste and configure the script

1. Copy the entire contents of `Code.gs` from this repository
2. Paste it into the Apps Script editor
3. Edit the configuration section at the top:

```javascript
var EMAIL_COLUMN  = "A";                          // Column with email addresses
var SUBJECT       = "Your subject line here";     // Email subject
var BODY          = `Your email body here`;       // Email body (use backticks)
var ATTACHMENT_ID = "YOUR_GOOGLE_DRIVE_FILE_ID";  // Paste your file ID here
var DAILY_LIMIT   = 450;                          // Max emails per day
var START_ROW     = 2;                            // First row with an email (2 skips header)
```

4. Press **Ctrl + S** (or Cmd + S on Mac) to save

> 💡 **Important:** The `BODY` variable uses backtick characters (`` ` ``) not regular quotes. This allows multi-line text. Do not change backticks to quotes or the script will break.

---

### Step 6 — Authorize the script

The first time you run the script, Google will ask for permissions:

1. Click **Run** (▶ play button) in the toolbar
2. A popup appears: **"Authorization required"** → click **Review permissions**
3. Select your Google account
4. You may see: **"Google hasn't verified this app"**
   - This is normal for personal scripts — click **Advanced**
   - Click **"Go to [project name] (unsafe)"**
   - Click **Allow**

> ✅ This warning appears because the script isn't published to the Google Marketplace. Since you wrote it yourself and it only accesses your own Gmail and Drive, it is completely safe to allow.

---

### Step 7 — Test run

Before sending to your full list, always do a test:

1. In your sheet, temporarily replace a few emails with your own email address
2. Change `DAILY_LIMIT` to `2`:
   ```javascript
   var DAILY_LIMIT = 2;
   ```
3. Click **Run**
4. Check your inbox — you should receive the email with the attachment
5. Check your sheet — column B should say **"Sent"**, column C should show the timestamp
6. If everything looks correct:
   - Restore your real email list
   - Change `DAILY_LIMIT` back to `450`
   - Clear the "Sent" status from your test rows if needed

---

### Step 8 — Schedule automatic sends

To have the script run automatically every day at a set time:

1. In the Apps Script editor, click the **clock icon** (Triggers) in the left sidebar
2. Click **+ Add Trigger** (bottom right)
3. Configure the trigger:

   | Setting | Value |
   |---------|-------|
   | Function to run | `sendBulkEmails` |
   | Deployment | `Head` |
   | Event source | `Time-driven` |
   | Type of time trigger | `Day timer` |
   | Time of day | Choose your preferred 1-hour window |

4. Click **Save**

> ⚠️ Google schedules triggers within a 1-hour window, not at an exact minute. "10am to 11am" means the script will fire sometime between 10:00 and 11:00.

> 💡 The script runs on Google's servers — your computer does not need to be on or your browser open.

**To stop the trigger** after all emails are sent:
- Go to Triggers → click the three dots next to your trigger → **Delete**

---

## Configuration Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `EMAIL_COLUMN` | The sheet column containing email addresses | `"A"` |
| `SUBJECT` | The email subject line | — |
| `BODY` | The email body text (use backticks for multi-line) | — |
| `ATTACHMENT_ID` | Google Drive File ID of your attachment | — |
| `DAILY_LIMIT` | Maximum emails to send per run | `450` |
| `START_ROW` | First row containing an email address | `2` |

---

## Gmail Sending Limits

| Account Type | Hard Daily Limit | Recommended Script Limit |
|---|---|---|
| Free Gmail (@gmail.com) | 500/day | 450/day |
| Google Workspace | 2,000/day | 1,800/day |

The script's `DAILY_LIMIT` of 450 gives a 50-email safety buffer below Gmail's 500/day hard cap. Exceeding Gmail's limit will result in a temporary sending suspension.

---

## How It Works

```
Google Sheet (email list)
        │
        ▼
Apps Script reads each row
        │
        ├─ Skips blank rows
        ├─ Skips rows already marked "Sent"
        │
        ▼
Fetches attachment blob from Google Drive
        │
        ▼
GmailApp.sendEmail() sends the email
        │
        ▼
Marks row "Sent" + logs timestamp in sheet
        │
        ▼
Sleeps 1 second → moves to next row
        │
        ▼
Stops when DAILY_LIMIT is reached or list ends
```

---

## Tracking Sent Emails

After running, your sheet will look like this:

| A (Email) | B (Status) | C (Timestamp) |
|-----------|------------|---------------|
| someone@gmail.com | Sent | 08/06/2026 10:14:32 |
| another@company.com | Sent | 08/06/2026 10:14:34 |
| bad-email@ | Error: Invalid email | |
| next@company.com | | |

- **Sent** — email delivered successfully
- **Error: [message]** — something went wrong; check the email address
- **Blank** — not yet sent; will be picked up on the next run

---

## Troubleshooting

**"The function sendBulkEmails could not be found"**
→ Make sure you saved the script (Ctrl+S) before setting up the trigger.

**"Google hasn't verified this app"**
→ Normal for personal scripts. Click Advanced → Go to project (unsafe) → Allow.

**Emails not arriving / going to spam**
→ Ask a test recipient to check their spam folder and mark as "Not spam". Sending from a free Gmail account increases spam likelihood.

**"Invalid argument" or "Bad request" error in column B**
→ That email address is malformed. Fix or delete it from the sheet.

**Script stops before finishing the list**
→ You've hit the `DAILY_LIMIT`. It will continue from where it left off on the next run (skipping already-sent rows).

**Attachment not sending**
→ Double-check the `ATTACHMENT_ID`. Make sure the file is not in the Trash in Google Drive. Make sure sharing is set to "Anyone with the link can view".

---

## FAQs

**Can I send to more than 500 people?**
Yes — the script automatically resumes from unsent rows on each run. With a daily trigger set, it sends 450/day until the list is exhausted.

**Will it send duplicates?**
No. The script checks column B before sending. Any row marked "Sent" is skipped permanently.

**Can I add personalization (names, company names)?**
Yes — add extra columns to your sheet (e.g. column D = First Name) and modify the BODY to read those values using `sheet.getRange("D" + i).getValue()`.

**Does my computer need to stay on?**
No. The trigger runs on Google's servers. Close your laptop after setting up the trigger.

**Is this free?**
Yes, entirely free for up to 500 emails/day using a standard Gmail account.

---

## License

MIT License — free to use, modify, and distribute.

---

*Built by [Sameep Godawale](https://linkedin.com/in/sameepgodawale) | [GitHub](https://github.com/sameepgodawale)*
