const fs = require('fs');
const content = fs.readFileSync('scripts/generate-ssg.js', 'utf8');
const indexPhp = content.split('const indexPhp = `')[1].split('`;')[0];
fs.writeFileSync('dist/index.php', indexPhp);
console.log("Updated index.php successfully");
