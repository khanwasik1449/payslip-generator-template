# Employee Payslip Generator (Google Apps Script Template)

This project is a **Google Apps Script Web App** that generates employee payslips as PDFs using Google Docs template + Drive.

## 🚀 Features
- Input employee details via HTML form
- Auto-calculates salary components (Basic, House Rent, Medical, Conveyance)
- Deduction & Net Salary calculation
- Stores logs in Google Sheets
- Generates & saves PDF in Google Drive

## 📂 Project Structure
- `Code.gs` → Apps Script backend
- `index.html` → Frontend form
- `appsscript.json` → Project manifest

## 🔧 Setup
1. Clone repo
2. Open in [clasp](https://github.com/google/clasp) or Google Apps Script editor
3. Replace `templateId` and `folderId` with your own Google Docs & Drive IDs
4. Deploy as a **Web App** (Publish → Deploy → Web App)

