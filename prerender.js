import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function prerender() {
  console.log('Starting prerender process...');
  
  // Paths
  const distPath = path.join(__dirname, 'dist');
  const indexPath = path.join(distPath, 'index.html');
  const termsPath = path.join(distPath, 'terms');
  
  // Create browser instance
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Create terms directory if it doesn't exist
    if (!fs.existsSync(termsPath)) {
      fs.mkdirSync(termsPath, { recursive: true });
    }
    
    // Prerender main page
    console.log('Prerendering main page...');
    const mainPage = await browser.newPage();
    await mainPage.goto(`file://${indexPath}`, { waitUntil: 'networkidle0' });
    
    // Wait for React to render
    await mainPage.waitForSelector('#root > div', { timeout: 5000 });
    
    // Get the rendered HTML
    const mainHtml = await mainPage.content();
    fs.writeFileSync(indexPath, mainHtml);
    console.log('Main page prerendered successfully');
    
    // Prerender terms page
    console.log('Prerendering terms page...');
    const termsPage = await browser.newPage();
    await termsPage.goto(`file://${indexPath}#terms`, { waitUntil: 'networkidle0' });
    
    // Wait for React to render the terms section
    await termsPage.waitForSelector('#terms', { timeout: 5000 });
    
    // Get the rendered HTML
    const termsHtml = await termsPage.content();
    fs.writeFileSync(path.join(termsPath, 'index.html'), termsHtml);
    console.log('Terms page prerendered successfully');
    
  } catch (error) {
    console.error('Error during prerendering:', error);
    process.exit(1);
  } finally {
    await browser.close();
    console.log('Prerender process completed');
  }
}

prerender();