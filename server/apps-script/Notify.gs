/** Google Sheet is a mirror/reporting layer only — never read back as source of truth. */
function appendLeadToSheet(lead) {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Leads') ||
    SpreadsheetApp.openById(sheetId).insertSheet('Leads');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(LEAD_COLUMNS);
  }
  sheet.appendRow(LEAD_COLUMNS.map(function (col) { return lead[col] || ''; }));
}

function sendLeadEmail(lead) {
  var to = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  var body = LEAD_COLUMNS.map(function (col) {
    return col + ': ' + (lead[col] || '');
  }).join('\n');
  MailApp.sendEmail(to, 'New lead: ' + lead.name, body);
}

function sendLeadTelegram(lead) {
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('TG_TOKEN');
  var chatId = props.getProperty('TG_CHAT_ID');
  var lines = [
    'New lead: ' + lead.name,
    'Phone: ' + lead.phone,
    'Interest: ' + lead.interest,
    'Preferred contact: ' + lead.preferredContact,
    lead.whatsappNumber ? 'WhatsApp: ' + lead.whatsappNumber : null,
    lead.college ? 'College: ' + lead.college : null,
    lead.year ? 'Year: ' + lead.year : null,
    lead.location ? 'Location: ' + lead.location : null,
    lead.message ? 'Message: ' + lead.message : null
  ].filter(function (l) { return l; });

  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    payload: { chat_id: chatId, text: lines.join('\n') },
    muteHttpExceptions: true
  });
}

/** Every channel failure lands here instead of failing the whole submission. */
function logError(context, err, payload) {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName('_errors') ||
    SpreadsheetApp.openById(sheetId).insertSheet('_errors');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['timestamp', 'context', 'error', 'payload']);
  }
  sheet.appendRow([
    new Date().toISOString(),
    context,
    String(err && err.message ? err.message : err),
    JSON.stringify(payload)
  ]);
}
