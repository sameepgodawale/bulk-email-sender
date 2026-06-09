// ═══════════════════════════════════════════════════════════════
//  Bulk Email Sender — Google Apps Script
//  Author : Sameep Godawale
//  GitHub : github.com/sameepgodawale/bulk-email-sender
//  License: MIT
// ═══════════════════════════════════════════════════════════════

// ── CONFIG — edit these lines only ────────────────────────────
var ENABLED       = true;                         // ← Set false to pause sending, true to resume
var EMAIL_COLUMN  = "A";                          // Column containing email addresses
var SUBJECT       = "Seeking Internship / Entry-Level Role";
var BODY          = `Dear Sir/Ma'am,

For my final year project, I built a VANET-based accident detection system implementing real-time network communication, low-latency data transmission, and vehicle-to-vehicle protocol design from scratch. That project is what drove me to pursue networking professionally.

I'm a freshly graduated Electronics & Telecom Engineer (BE, 2026) with hands-on experience in TCP/IP, subnetting, routing & switching, VLANs, and network protocols, currently pursuing CCNA. I'm comfortable with Packet Tracer, GNS3, and Linux, and I'm continuously working on improving my skills in real-world networking environments.

I'm based in Thane and open to roles in Thane, Navi Mumbai, Mumbai, and Pune as well as pan-India and remote opportunities.

Would you be open to a 15-minute call this week? I'd be happy to share more about my work or send across my resume.

Best regards,
Sameep Godawale
+91-98928 33212 | sameepgodawale@gmail.com
linkedin.com/in/sameepgodawale | github.com/sameepgodawale`;

var ATTACHMENT_ID = "YOUR_GOOGLE_DRIVE_FILE_ID";  // Replace with your Drive file ID
var DAILY_LIMIT   = 450;                           // Safe limit under Gmail's 500/day cap
var START_ROW     = 2;                             // Row where emails start (2 = skip header row)
// ──────────────────────────────────────────────────────────────


/**
 * Main function — sends bulk emails from the active Google Sheet.
 *
 * How it works:
 * - Checks ENABLED flag first — if false, exits immediately (nothing is sent)
 * - Reads email addresses from EMAIL_COLUMN
 * - Skips rows already marked "Sent" in column B
 * - Attaches the file specified by ATTACHMENT_ID from Google Drive
 * - Marks each sent row with "Sent" and a timestamp
 * - Stops after DAILY_LIMIT emails to stay within Gmail quota
 *
 * To pause sending:  set ENABLED = false  (save the script)
 * To resume sending: set ENABLED = true   (save the script)
 */
function sendBulkEmails() {

  // ── On/Off switch ──────────────────────────────────────────
  if (!ENABLED) {
    Logger.log("Sending is disabled. Set ENABLED = true to resume.");
    SpreadsheetApp.getUi().alert("Sending is currently disabled.\n\nTo resume, open the script and set:\nvar ENABLED = true");
    return;
  }
  // ──────────────────────────────────────────────────────────

  var sheet     = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow   = sheet.getLastRow();
  var file      = DriveApp.getFileById(ATTACHMENT_ID);
  var blob      = file.getBlob();
  var sentCount = 0;
  var skipped   = 0;
  var errors    = 0;

  Logger.log("Starting bulk email send. Total rows: " + (lastRow - START_ROW + 1));

  for (var i = START_ROW; i <= lastRow; i++) {
    if (sentCount >= DAILY_LIMIT) {
      Logger.log("Daily limit of " + DAILY_LIMIT + " reached. Stopping at row " + i);
      break;
    }

    var email  = sheet.getRange(EMAIL_COLUMN + i).getValue();
    var status = sheet.getRange("B" + i).getValue();

    // Skip empty rows or already sent
    if (!email || status === "Sent") {
      skipped++;
      continue;
    }

    try {
      GmailApp.sendEmail(email, SUBJECT, BODY, {
        attachments: [blob]
      });
      sheet.getRange("B" + i).setValue("Sent");
      sheet.getRange("C" + i).setValue(new Date());
      sentCount++;
      Utilities.sleep(1000); // 1 second delay between sends to avoid rate limiting
    } catch(e) {
      sheet.getRange("B" + i).setValue("Error: " + e.message);
      Logger.log("Error sending to " + email + ": " + e.message);
      errors++;
    }
  }

  var summary = "Done!\n\nSent: " + sentCount + "\nSkipped: " + skipped + "\nErrors: " + errors;
  Logger.log(summary);
  SpreadsheetApp.getUi().alert(summary);
}
