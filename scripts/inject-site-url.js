import fs from 'fs';
import path from 'path';

// Parse VITE_SITE_URL directly from root .env configuration
let siteUrl = 'https://bluesapphiregemstones.com';
const envPath = path.resolve('.env');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/VITE_SITE_URL\s*=\s*(.*)/);
  if (match && match[1]) {
    const rawVal = match[1].trim();
    // Strip comments if present
    const cleanVal = rawVal.split('#')[0].trim();
    if (cleanVal) {
      siteUrl = cleanVal.replace(/\/$/, '');
    }
  }
}

const distDir = path.resolve('dist');
const sitemapPath = path.join(distDir, 'sitemap.xml');
const robotsPath = path.join(distDir, 'robots.txt');

// 1. Replace __SITE_URL__ placeholders inside sitemap.xml
if (fs.existsSync(sitemapPath)) {
  let content = fs.readFileSync(sitemapPath, 'utf8');
  content = content.replace(/__SITE_URL__/g, siteUrl);
  fs.writeFileSync(sitemapPath, content, 'utf8');
  console.log(`[SEO Build] Sitemap XML URLs updated to: ${siteUrl}`);
} else {
  console.warn(`[SEO Build Warning] sitemap.xml not found at: ${sitemapPath}`);
}

// 2. Replace __SITE_URL__ placeholders inside robots.txt
if (fs.existsSync(robotsPath)) {
  let content = fs.readFileSync(robotsPath, 'utf8');
  content = content.replace(/__SITE_URL__/g, siteUrl);
  fs.writeFileSync(robotsPath, content, 'utf8');
  console.log(`[SEO Build] Robots.txt Sitemap reference updated to: ${siteUrl}`);
} else {
  console.warn(`[SEO Build Warning] robots.txt not found at: ${robotsPath}`);
}
