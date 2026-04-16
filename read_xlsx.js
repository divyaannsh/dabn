const XLSX = require('xlsx');
const path = require('path');

const filePath = '/Users/divyanshsrivastava/prerna/PL17- Staying ahead! n.xlsx';
const workbook = XLSX.readFile(filePath);

workbook.SheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Read as array of arrays
  console.log(`--- Sheet: ${sheetName} ---`);
  console.log(JSON.stringify(data.slice(0, 10), null, 2));
});
