import fs from 'fs';
import path from 'path';

// List of files to inspect
const filesToCheck = [
  'src/data/gemstones.ts',
  'src/components/AboutSection.tsx',
  'src/components/CollectionSection.tsx',
  'src/pages/About.tsx',
  'src/pages/Contact.tsx',
  'src/pages/Gallery.tsx',
  'src/components/AboutExpertise.css'
];

let allPassed = true;

filesToCheck.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  
  // Find strings matching "/Images/..." or "/Videos/..." inside quotes
  const imageRegex = /["'](\/(Images|Videos)\/[^"']+)["']/g;
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    const virtualPath = match[1];
    // Clean path and make absolute
    const physicalPath = path.join('public', virtualPath);
    if (fs.existsSync(physicalPath)) {
      console.log(`[PASS] Reference: ${virtualPath} inside ${file} -> exists on disk`);
    } else {
      console.log(`[FAIL] Reference: ${virtualPath} inside ${file} -> DOES NOT EXIST on disk! (Looking for: ${physicalPath})`);
      allPassed = false;
    }
  }
});

if (allPassed) {
  console.log('\nAll source references perfectly match files on disk!');
} else {
  console.log('\nSome references are mismatching!');
}
