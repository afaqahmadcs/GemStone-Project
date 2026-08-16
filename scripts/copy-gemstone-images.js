import fs from 'fs';
import path from 'path';

const artifactsDir = 'C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\6f47b78a-3323-4cc7-9815-9c87d6fff2b0';
const publicImagesDir = path.resolve('public/Images');

// Find files starting with tourmaline and amethyst in the artifacts dir
const files = fs.readdirSync(artifactsDir);
const tourmalineFile = files.find(f => f.startsWith('tourmaline_') && f.endsWith('.jpg'));
const amethystFile = files.find(f => f.startsWith('amethyst_') && f.endsWith('.jpg'));

if (tourmalineFile) {
  const src = path.join(artifactsDir, tourmalineFile);
  const dest = path.join(publicImagesDir, 'Tourmaline.jpeg');
  fs.copyFileSync(src, dest);
  console.log(`Copied Tourmaline from ${src} to ${dest}`);
} else {
  console.log('Tourmaline file not found in artifacts directory!');
}

if (amethystFile) {
  const src = path.join(artifactsDir, amethystFile);
  const dest = path.join(publicImagesDir, 'Amethyst.jpeg');
  fs.copyFileSync(src, dest);
  console.log(`Copied Amethyst from ${src} to ${dest}`);
} else {
  console.log('Amethyst file not found in artifacts directory!');
}
