const puppeteer = require('puppeteer-core');

const ROUTES = [
  { path: '#/', name: 'Home' },
  { path: '#/about', name: 'About' },
  { path: '#/skills', name: 'Skills' },
  { path: '#/experience', name: 'Experience' },
  { path: '#/education', name: 'Education' },
  { path: '#/projects', name: 'Projects' },
  { path: '#/project/1', name: 'ProjectDetail' },
  { path: '#/achievements', name: 'Achievements' },
  { path: '#/services', name: 'Services' },
  { path: '#/multimedia-works', name: 'MultimediaWorks' },
  { path: '#/contact', name: 'Contact' },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  page.on('console', m => {
    if (['error','warning'].includes(m.type()))
      console.log('  [BROWSER]', m.type(), m.text().substring(0, 200));
  });
  page.on('pageerror', e => console.log('  [PAGE_ERR]', e.message.substring(0, 200)));

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  let passed = 0;
  let failed = 0;

  for (const route of ROUTES) {
    console.log(`\n--- ${route.name} ---`);
    
    let ok = false;
    let reason = 'timeout';
    
    try {
      await page.evaluate((hash) => { window.location.hash = hash; }, route.path);
      await new Promise(r => setTimeout(r, 1500));
      
      // Check rendering with a timeout
      const result = await Promise.race([
        page.evaluate(() => {
          const outlet = document.getElementById('route-outlet');
          if (!outlet) return { status: 'error', msg: 'no outlet' };
          const html = outlet.innerHTML;
          return { status: 'ok', len: html.length, text: document.body.innerText.substring(0, 120).replace(/\n/g, ' ') };
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('evaluate timeout')), 10000))
      ]);
      
      if (result.status === 'ok') {
        if (result.len > 50) {
          console.log(`  PASS: ${result.len} chars - ${result.text}`);
          passed++;
        } else {
          console.log(`  FAIL: only ${result.len} chars`);
          failed++;
        }
        ok = true;
      } else {
        reason = result.msg;
      }
    } catch (err) {
      reason = err.message.substring(0, 150);
    }
    
    if (!ok) {
      console.log(`  FAIL: ${reason}`);
      failed++;
    }
  }

  console.log(`\n========================================`);
  console.log(`RESULTS: ${passed} passed, ${failed} failed out of ${ROUTES.length}`);
  console.log(`========================================`);

  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
})();
