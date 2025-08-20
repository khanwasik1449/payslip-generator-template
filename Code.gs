/**
 * Web App entry point
 * Serves the index.html file
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

/**
 * Generate Payslip PDF
 * @param {Object} data - Employee data from form
 */
function generatePayslip(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const allSheet = ss.getSheetByName("All") || ss.insertSheet("All");

  // Salary Components (50% Basic, 30% House Rent, 10% Medical, 10% Conveyance)
  const basic = Math.round(0.5 * data.salary);
  const houseRent = Math.round(0.3 * data.salary);
  const medical = Math.round(0.1 * data.salary);
  const conveyance = Math.round(0.1 * data.salary);

  // Total Deductions
  const totalDeductions = data.transport + data.tax + data.otherDeductions;

  // Net Salary
  const netSalary = data.salary + data.allowance - totalDeductions;

  // Log to "All" sheet
  allSheet.appendRow([
    new Date(), data.employeeName, data.pin, data.designation,
    data.joiningDate, data.salary, data.payslipMonth,
    data.transport, data.allowance, data.tax, data.otherDeductions,
    totalDeductions, netSalary, basic, houseRent, medical, conveyance
  ]);

  // Placeholder map for template replacement
  const map = {
    '{{employeeName}}': data.employeeName,
    '{{pin}}': data.pin,
    '{{designation}}': data.designation,
    '{{joiningDate}}': data.joiningDate,
    '{{salary}}': data.salary,
    '{{payslipMonth}}': data.payslipMonth,
    '{{transport}}': data.transport,
    '{{allowance}}': data.allowance,
    '{{tax}}': data.tax,
    '{{otherDeductions}}': data.otherDeductions,
    '{{totalDeductions}}': totalDeductions,
    '{{netSalary}}': netSalary,
    '{{basic}}': basic,
    '{{houseRent}}': houseRent,
    '{{medical}}': medical,
    '{{conveyance}}': conveyance
  };

  // === Google Docs Template & Drive Folder IDs ===
  // Replace with your own IDs before use
  const templateId = 'YOUR_DOC_TEMPLATE_ID_HERE';
  const folderId = 'YOUR_DRIVE_FOLDER_ID_HERE'; // optional

  // Copy template → Replace placeholders
  const template = DriveApp.getFileById(templateId);
  const copy = template.makeCopy(`Payslip - ${data.employeeName}`);
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();

  for (let key in map) {
    body.replaceText(key, map[key]);
  }
  doc.saveAndClose();

  // Export PDF
  const pdfBlob = DriveApp.getFileById(copy.getId())
    .getAs('application/pdf')
    .setName(`Payslip_${data.employeeName}.pdf`);

  let file;
  if (folderId && folderId !== 'YOUR_DRIVE_FOLDER_ID_HERE') {
    const folder = DriveApp.getFolderById(folderId);
    file = folder.createFile(pdfBlob);
    DriveApp.getFileById(copy.getId()).setTrashed(true); // Delete temp Doc
  } else {
    file = DriveApp.createFile(pdfBlob);
  }

  return file.getUrl();
}
