import fs from 'fs';
import path from 'path';

const publicImagesDir = path.resolve('public/Images');
console.log('--- Files on disk in public/Images ---');
const files = fs.readdirSync(publicImagesDir);
files.forEach(f => {
  console.log(`${f} -> Char codes: ${[...f].map(c => c.charCodeAt(0).toString(16)).join(' ')}`);
});

console.log('\n--- Checking references in source code ---');
const checkFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.match(/\/Images\/[^"'\s>]+/g);
    if (matches) {
      matches.forEach(m => {
        console.log(`${filePath}: ${m} -> Char codes: ${[...m].map(c => c.charCodeAt(0).toString(16)).join(' ')}`);
      });
    }
  }
};

checkFile('src/data/gemstones.ts');
checkFile('src/components/AboutSection.tsx');
checkFile('src/components/CollectionSection.tsx');
checkFile('src/pages/About.tsx');
checkFile('src/pages/Contact.tsx');
checkFile('src/pages/Gallery.tsx');

// Check in CSS
const checkCss = (filePath) => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.match(/url\(['"][^'"]+['"]\)/g);
    if (matches) {
      matches.forEach(m => {
        console.log(`${filePath}: ${m} -> Char codes: ${[...m].map(c => c.charCodeAt(0).toString(16)).join(' ')}`);
      });
    }
  }
};
checkCss('src/components/AboutExpertise.css');
