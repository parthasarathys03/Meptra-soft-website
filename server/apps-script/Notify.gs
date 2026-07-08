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

/** Update the row in Google Sheet that matches the lead's submissionId. */
function updateLeadInSheet(lead) {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheetByName('Leads');
  if (!sheet) return false;

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false; // only header or empty

  // submissionId is the first column (index 1). Search bottom-up for efficiency.
  var data = sheet.getRange(2, 1, lastRow - 1, 1).getValues(); // column A, rows 2..lastRow
  for (var i = data.length - 1; i >= 0; i--) {
    if (String(data[i][0]) === lead.submissionId) {
      var rowNum = i + 2; // +2 because data index 0 = row 2
      var rowValues = LEAD_COLUMNS.map(function (col) { return lead[col] || ''; });
      sheet.getRange(rowNum, 1, 1, LEAD_COLUMNS.length).setValues([rowValues]);
      return true;
    }
  }
  return false;
}

/** Delete the row from Google Sheet that matches the given submissionId (column 1). */
function deleteLeadFromSheet(submissionId) {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheetByName('Leads');
  if (!sheet) return; // no Leads sheet — nothing to delete

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return; // only header or empty

  // submissionId is the first column (index 1). Search bottom-up for efficiency.
  var data = sheet.getRange(2, 1, lastRow - 1, 1).getValues(); // column A, rows 2..lastRow
  for (var i = data.length - 1; i >= 0; i--) {
    if (String(data[i][0]) === submissionId) {
      sheet.deleteRow(i + 2); // +2 because data index 0 = row 2
      return;
    }
  }
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

/** Google Sheet is a mirror/reporting layer only — never read back as source of truth. */
function appendApplicationToSheet(application) {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Applications') ||
    SpreadsheetApp.openById(sheetId).insertSheet('Applications');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(APPLICATION_COLUMNS);
  }
  sheet.appendRow(APPLICATION_COLUMNS.map(function (col) { return application[col] || ''; }));
}

/** Update the row in Google Sheet that matches the application's submissionId. */
function updateApplicationInSheet(application) {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheetByName('Applications');
  if (!sheet) return false;

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;

  var data = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (String(data[i][0]) === application.submissionId) {
      var rowNum = i + 2;
      var rowValues = APPLICATION_COLUMNS.map(function (col) { return application[col] || ''; });
      sheet.getRange(rowNum, 1, 1, APPLICATION_COLUMNS.length).setValues([rowValues]);
      return true;
    }
  }
  return false;
}

/** Delete the row from Google Sheet that matches the given submissionId (column 1). */
function deleteApplicationFromSheet(submissionId) {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheetByName('Applications');
  if (!sheet) return;

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return;

  var data = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (String(data[i][0]) === submissionId) {
      sheet.deleteRow(i + 2);
      return;
    }
  }
}

function sendApplicationEmail(application) {
  var to = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  var body = APPLICATION_COLUMNS.map(function (col) {
    return col + ': ' + (application[col] || '');
  }).join('\n');
  MailApp.sendEmail(to, 'New job application: ' + application.name + ' — ' + application.roleTitle, body);
}

function sendApplicationTelegram(application) {
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('TG_TOKEN');
  var chatId = props.getProperty('TG_CHAT_ID');
  var lines = [
    'New application: ' + application.name,
    'Role: ' + application.roleTitle,
    'Phone: ' + application.phone,
    'Email: ' + application.email,
    application.resumeUrl ? 'Resume: ' + application.resumeUrl : null
  ].filter(function (l) { return l; });

  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    payload: { chat_id: chatId, text: lines.join('\n') },
    muteHttpExceptions: true
  });
}
