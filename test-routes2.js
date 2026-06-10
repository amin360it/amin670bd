const puppeteer = require('puppeteer-core');

const ROUTES = [
  { path: '#/', name: 'Home', check: 'hero-title' },
  { path: '#/about', name: 'About', check: 'About' },
  { path: '#/skills', name: 'Skills', check: 'Skills' },
  { path: '#/experience', name: 'Experience', check: 'Experience' },
  { path: '#/education', name: 'Education', check: 'Education' },
  { path: '#/projects', name: 'Projects', check: 'Projects' },
  { path: '#/project/1', name: 'ProjectDetail (id=1)', check: 'Project' },
  { path: '#/achievements', name: 'Achievements', check: 'Achievements' },
  { path: '#/services', name: 'Services', check: 'Services' },
  { path: '#/multimedia-works', name: 'MultimediaWorks', check: 'Multimedia' },
  { path: '#/contact', name: 'Contact', check: 'Contact' },
  { path: '#/nonexistent', name: 'Catch-all → Home redirect', check: 'hero' },
];

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  let globalErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') globalErrors.push({ type: 'console', text: msg.text() });
  });
  page.on('pageerror', err => globalErrors.push({ type: 'page', text: err.message }));

  // Initial load
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 15000 });
  await sleep(2000);
  
  console.log('Initial global errors:', globalErrors.length);
  globalErrors.forEach(e => console.log('  ', e.type, e.text));
  globalErrors = [];

  let passed = 0;
  let failed = 0;

  for (const route of ROUTES) {
    console.log(`\n--- ${route.name} ---`);
    
    await page.evaluate((hash) => { window.location.hash = hash; }, route.path);
    await sleep(1500);

    const result = await page.evaluate((check) => {
      const outlet = document.getElementById('route-outlet');
      if (!outlet) return { status: 'FAIL', reason: 'No route-outlet' };
      const html = outlet.innerHTML;
      const text = document.body.innerText;
      return {
        outletHTMLlength: html.length,
        containsCheck: text.includes(check) || html.includes(check),
        textSnippet: text.substring(0, 150).replace(/\n/g, ' '),
        noScriptTag: !html.includes('<script'),
        status: 'ok'
      };
    }, route.check);

    if (result.status === 'FAIL') {
      console.log(`  FAIL: ${result.reason}`);
      failed++;
    } else if (result.outletHTMLlength > 50 && result.noScriptTag) {
      console.log(`  PASS: ${result.outletHTMLlength} chars, contains '${route.check}': ${result.containsCheck}`);
      console.log(`  Text: ${result.textSnippet}`);
      passed++;
    } else {
      console.log(`  ${result.outletHTMLlength > 50 ? 'PASS' : 'FAIL'}: ${result.outletHTMLlength} chars, containsCheck: ${result.containsCheck}, scriptTag: ${!result.noScriptTag}`);
      if (result.outletHTMLlength > 50) passed++; else failed++;
    }

    // Check for newly accumulated errors
    if (globalErrors.length > 0) {
      console.log(`  JS Errors during this route:`);
      globalErrors.forEach(e => console.log(`    ${e.type}: ${e.text}`));
      globalErrors = [];
    }
  }

  console.log(`\n========================================`);
  console.log(`RESULTS: ${passed} passed, ${failed} failed out of ${ROUTES.length}`);
  console.log(`========================================`);

  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
})();
