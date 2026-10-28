import fs from 'fs';
import path from 'path';

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      content = content.replace(/from\s+['"](\.[^'"]+)['"]/g, (match, p1) => {
        if (!p1.endsWith('.js') && !p1.endsWith('.ts')) {
          return `from '${p1}.js'`;
        }
        return match;
      });
      fs.writeFileSync(fullPath, content);
    }
  }
}

fixImports('./src/pgs');
fixImports('./src/rooms');
fixImports('./src/common/pipes');
console.log('Fixed imports!');

fixImports('./src/tenants');
