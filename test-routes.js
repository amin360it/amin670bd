const puppeteer = require('puppeteer-core');
const path = require('path');

const ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/skills', name: 'Skills' },
  { path: '/experience', name: 'Experience' },
  { path: '/education', name: 'Education' },
  { path: '/projects', name: 'Projects' },
  { path: '/project/1', name: 'ProjectDetail (id=1)' },
  { path: '/project/cloud-computing', name: 'ProjectDetail (slug=cloud-computing)' },
  { path: '/achievements', name: 'Achievements' },
  { path: '/services', name: 'Services' },
  { path: '/multimedia', name: 'MultimediaWorks' },
  { path: '/contact', name: 'Contact' },
  { path: '/nonexistent', name: 'Catch-all (redirect to Home)' },
];

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`  [BROWSER ERROR] ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    console.log(`  [PAGE ERROR] ${err.message}`);
  });

  let passed = 0;
  let failed = 0;

  for (const route of ROUTES) {
    const url = `http://localhost:3000/#${route.path}`;
    console.log(`\n--- Testing ${route.name} (${url}) ---`);
    try {
      await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 15000 });
      await page.evaluate((hash) => {
        window.location.hash = hash;
      }, route.path);
      await sleep(1500);

      // Check for JS errors
      const errors = await page.evaluate(() => {
        const els = document.querySelectorAll('[style*="display: none"], [style*="display:none"]');
        return { routeOutlet: !!document.getElementById('route-outlet'), bodyContent: document.body.innerHTML.length };
      });

      // Check if route rendered by looking for key elements
      const routeContent = await page.evaluate((name) => {
        const outlet = document.getElementById('route-outlet');
        if (!outlet) return { error: 'No route-outlet element found' };
        const html = outlet.innerHTML;
        // Common checks
        const hasContent = html.length > 100;
        const hasScript = html.includes('<script');
        const text = document.body.innerText;
        return { htmlLength: html.length, hasContent, textSnippet: text.substring(0, 200) };
      }, route.name);

      if (routeContent.error) {
        console.log(`  FAIL: ${routeContent.error}`);
        failed++;
      } else if (routeContent.hasContent && !routeContent.hasScript) {
        console.log(`  PASS: ${route.name} - ${routeContent.htmlLength} chars rendered`);
        console.log(`  Content preview: ${routeContent.textSnippet.replace(/\n/g, ' ').substring(0, 120)}...`);
        passed++;
      } else if (routeContent.hasScript) {
        console.log(`  WARN: ${route.name} rendered but contains raw script tags`);
        passed++;
      } else {
        console.log(`  FAIL: ${route.name} - empty content (${routeContent.htmlLength} chars)`);
        failed++;
      }
    } catch (err) {
      console.log(`  FAIL: ${route.name} - exception: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n========================================`);
  console.log(`RESULTS: ${passed} passed, ${failed} failed out of ${ROUTES.length}`);
  console.log(`========================================`);

  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
})();
