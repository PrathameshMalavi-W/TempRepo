const fs = require('fs');
const path = require('path');

const contextPath = path.join(__dirname, 'context.md');
const pocDir = path.join(__dirname, 'Poc');

const content = fs.readFileSync(contextPath, 'utf8');

const blocks = content.split('## File: ./');
for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const firstNewline = block.indexOf('\n');
    const filePath = block.substring(0, firstNewline).trim();
    
    let remainder = block.substring(firstNewline + 1);
    
    // Find first ```
    const codeStartMatch = remainder.match(/```[a-zA-Z0-9-]*\r?\n/);
    if (!codeStartMatch) {
       console.log('Could not find start code block for', filePath);
       continue;
    }
    const codeStartIdx = codeStartMatch.index + codeStartMatch[0].length;
    remainder = remainder.substring(codeStartIdx);
    
    // Find next ``` 
    const codeEndMatch = remainder.match(/\r?\n```/);
    let fileContent = '';
    if (!codeEndMatch) {
       fileContent = remainder; // end of file maybe
    } else {
       fileContent = remainder.substring(0, codeEndMatch.index);
    }
    
    console.log('Extracting', filePath);
    const fullPath = path.join(pocDir, filePath);
    const dir = path.dirname(fullPath);
    
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, fileContent, 'utf8');
}
console.log('Done extraction.');
