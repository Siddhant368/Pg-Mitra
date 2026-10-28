const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/from\s+['"](\.[^'"]+)['"]/g, (match, p1) => {
    if (!p1.endsWith('.js')) {
      return `from '${p1}.js'`;
    }
    return match;
  });
  
  if (file.includes('auth.controller.ts') || file.includes('auth.controller.spec.ts')) {
    content = content.replace(/import { Response, Request } from 'express';/, `import type { Response, Request } from 'express';`);
  }
  
  if (file.includes('main.ts')) {
    content = content.replace(/import \* as cookieParser from 'cookie-parser';/, `import cookieParser from 'cookie-parser';`);
  }
  
  fs.writeFileSync(file, content);
});
console.log('Fixed imports');
