const XLSX = require('xlsx');
const fs = require('fs');

const filePath = '/Users/divyanshsrivastava/prerna/PL17- Staying ahead! n.xlsx';
const workbook = XLSX.readFile(filePath);

const result = {};

workbook.SheetNames.forEach(sheetName => {
  const trimmedName = sheetName.trim();
  if (trimmedName === 'Sheet1') return;

  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
  const seriesData = [];
  let startIndex = 2;
  if (trimmedName === 'S series') startIndex = 3;

  data.slice(startIndex).forEach(row => {
    if (!row || row.length === 0 || (!row[0] && !row[1])) return;

    if (trimmedName === 'H series' || trimmedName === 'MLZ') {
      seriesData.push({
        danfoss: {
          model: row[0],
          tr: row[1],
          w: row[2],
          btu: row[3],
          dimensions: row[4],
          code: row[5]
        },
        copeland: {
          model: row[6],
          tr: row[7],
          w: row[8],
          btu: row[9],
          dimensions: row[10]
        }
      });
    } else if (trimmedName === 'S series') {
      seriesData.push({
        danfoss: {
          model: row[0],
          type: row[1],
          tr: row[2],
          w: row[3],
          btu: row[4],
          dimensions: row[5],
          code: row[6]
        },
        copeland: {
          model: row[7],
          type: row[8],
          tr: row[9],
          w: row[10],
          btu: row[11],
          dimensions: row[12]
        }
      });
    } else if (trimmedName === 'DSH') {
      seriesData.push({
        hz: row[0],
        danfoss: {
          model: row[1],
          tr: row[2],
          w: row[3],
          btu: row[4],
          dimensions: row[5],
          code: row[6]
        },
        copeland: {
          model: row[7],
          tr: row[8],
          w: row[9],
          btu: row[10],
          dimensions: row[11]
        }
      });
    }
  });
  result[trimmedName] = seriesData;
});

// Handle Sheet1 (MT/MTZ)
const sheet1 = workbook.Sheets['Sheet1'];
const sheet1Data = XLSX.utils.sheet_to_json(sheet1, { header: 1 });
const mtData = [];
sheet1Data.slice(4).forEach(row => {
    if (!row || !row[0]) return;
    mtData.push({
        danfoss: {
            mt: row[0],
            mtz: row[1],
            capacity: row[2]
        },
        copeland: {
            model: row[3],
            capacity: row[4]
        }
    });
});
result['MT_MTZ'] = mtData;

fs.writeFileSync('/Users/divyanshsrivastava/prerna/data.json', JSON.stringify(result, null, 2));
console.log('Data extracted to data.json');
