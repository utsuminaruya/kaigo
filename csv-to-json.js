// scripts/csv-to-json.js
// CSV列: id,title_ja,title_vi,company,city_ja,city_vi,areaPref,region,tags,salary_ja,salary_vi,visa_friendly,desc_ja,desc_vi,sample
const fs = require('fs');

const csvPath = process.argv[2] || './jobs.csv';
const outPath = './public/jobs.json';

if (!fs.existsSync(csvPath)) {
  console.error('CSVが見つかりません: ' + csvPath);
  process.exit(1);
}

const lines = fs.readFileSync(csvPath, 'utf8').trim().split(/\r?\n/);
const header = lines.shift().split(',');

const data = lines.map(line => {
  const cols = line.split(',');
  const obj = {};
  header.forEach((h, i) => obj[h] = (cols[i] ?? '').trim());
  obj.tags = (obj.tags || '').split('|').filter(Boolean);
  obj.visa_friendly = String(obj.visa_friendly).toLowerCase() === 'true';
  obj.sample = String(obj.sample).toLowerCase() === 'true';
  return obj;
});

fs.mkdirSync('./public', { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
console.log('OK:', outPath, data.length, '件');
