const fs = require('fs');
const path = require('path');

const input = path.join(__dirname, 'icons.csv');
const output = path.join(__dirname, '..', 'src', 'app', 'shared', 'icon-names.ts');

function parseCSVLine(line) {
  const fields = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        fields.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
  }
  fields.push(cur);
  return fields.map(f => f === 'NULL' ? '' : f);
}

function main() {
  if (!fs.existsSync(input)) {
    console.error('Input CSV not found:', input);
    process.exit(1);
  }
  const text = fs.readFileSync(input, 'utf8');
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) {
    console.error('CSV is empty');
    process.exit(1);
  }
  const header = lines.shift();
  const names = new Set();
  for (const line of lines) {
    const fields = parseCSVLine(line);
    // header: optlock,creationdate,modificationdate,body,guid,name,...
    const name = fields[5] || '';
    const clean = name.trim();
    if (clean) names.add(clean);
  }

  const arr = Array.from(names).sort();
  const outDir = path.dirname(output);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const content = `// GENERATED - icon names extracted from CSV\nexport const ICON_NAMES = [\n${arr.map(n => `  '${n.replace(/'/g, "\\'")}',`).join('\n')}\n];\n`;

  fs.writeFileSync(output, content, 'utf8');
  console.log('Wrote', output, 'with', arr.length, 'icons');
}

main();
