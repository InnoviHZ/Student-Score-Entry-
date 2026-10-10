const SCORE_COLUMNS = [
  { field: 'englishCA', header: 'English CA' },
  { field: 'englishExam', header: 'English Exam' },
  { field: 'mathematicsCA', header: 'Mathematics CA' },
  { field: 'mathematicsExam', header: 'Mathematics Exam' },
  { field: 'geographyCA', header: 'Geography CA' },
  { field: 'geographyExam', header: 'Geography Exam' },
  { field: 'biologyCA', header: 'Biology CA' },
  { field: 'biologyExam', header: 'Biology Exam' },
  { field: 'civicCA', header: 'Civic CA' },
  { field: 'civicExam', header: 'Civic Exam' },
  { field: 'chemistryCA', header: 'Chemistry CA' },
  { field: 'chemistryExam', header: 'Chemistry Exam' },
  { field: 'arabicCA', header: 'Arabic CA' },
  { field: 'arabicExam', header: 'Arabic Exam' },
  { field: 'hausaCA', header: 'Hausa CA' },
  { field: 'hausaExam', header: 'Hausa Exam' },
  { field: 'homeEconomicsCA', header: 'Home Economics CA' },
  { field: 'homeEconomicsExam', header: 'Home Economics Exam' },
  { field: 'elementaryScienceCA', header: 'Elementary Science CA' },
  { field: 'elementaryScienceExam', header: 'Elementary Science Exam' },
];

const HEADERS = [
  'Timestamp',
  'Full Name',
  'Admission Number',
  ...SCORE_COLUMNS.map((column) => column.header),
];

function doGet() {
  try {
    const sheet = getTargetSheet();
    return ContentService.createTextOutput(
      'Service is running. Connected to sheet: ' + sheet.getName()
    );
  } catch (error) {
    console.error(error);
    return ContentService.createTextOutput(
      'Service is unavailable: ' + getErrorMessage(error)
    );
  }
}

function doPost(e) {
  let lock;
  try {
    if (!e || !e.postData || typeof e.postData.contents !== 'string') {
      throw new Error('A JSON request body is required.');
    }

    const data = JSON.parse(e.postData.contents);
    validateSubmission(data);

    lock = LockService.getScriptLock();
    lock.waitLock(10000);

    const sheet = getTargetSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    const row = [
      new Date(),
      safeText(data.fullName),
      safeText(data.admissionNumber),
      ...SCORE_COLUMNS.map((column) => Number(data[column.field])),
    ];
    sheet.appendRow(row);

    return jsonResponse({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error(error);
    return jsonResponse({ success: false, error: getErrorMessage(error) });
  } finally {
    if (lock && lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function getTargetSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error('No spreadsheet is linked. Open Apps Script from the target Google Sheet.');
  }

  const sheet = spreadsheet.getActiveSheet();
  if (!sheet) {
    throw new Error('No active sheet was found in the linked spreadsheet.');
  }
  return sheet;
}

function validateSubmission(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Request body must be a JSON object.');
  }
  if (typeof data.fullName !== 'string' || !data.fullName.trim()) {
    throw new Error('Full name is required.');
  }
  if (typeof data.admissionNumber !== 'string' || !data.admissionNumber.trim()) {
    throw new Error('Admission number is required.');
  }

  SCORE_COLUMNS.forEach((column) => {
    const value = data[column.field];
    const score = Number(value);
    if (
      (typeof value !== 'number' && typeof value !== 'string') ||
      (typeof value === 'string' && !value.trim()) ||
      !Number.isFinite(score) ||
      score < 0 ||
      score > 100
    ) {
      throw new Error(column.header + ' must be a number between 0 and 100.');
    }
  });
}

function safeText(value) {
  const text = value.trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function getErrorMessage(error) {
  return error && error.message ? error.message : String(error);
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
