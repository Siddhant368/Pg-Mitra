const fs = require('fs'); 
const pages = ['pgs', 'rooms', 'students', 'payments', 'complaints', 'settings']; 
pages.forEach(p => { 
  fs.mkdirSync(`frontend/src/app/owner/${p}`, {recursive: true}); 
  fs.writeFileSync(`frontend/src/app/owner/${p}/page.tsx`, `import ComingSoon from '@/components/owner/ComingSoon';\n\nexport default function Page() {\n  return <ComingSoon title="${p.charAt(0).toUpperCase() + p.slice(1)}" />;\n}`); 
});
