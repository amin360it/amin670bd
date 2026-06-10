const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  let errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text().substring(0, 200));
  });
  page.on('pageerror', err => errors.push('PAGE: ' + err.message.substring(0, 200)));

  // Load Home first
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('Initial errors:', errors.length);
  errors.forEach(e => console.log('  ', e));
  
  const tinyVue = await page.evaluate(() => !!window.tinyVue);
  const components = await page.evaluate(() => !!window.tinyVueComponents);
  const outlet = await page.evaluate(() => {
    const o = document.getElementById('route-outlet');
    return o ? o.innerHTML.length : 'NOT FOUND';
  });
  console.log('tinyVue:', tinyVue, 'components:', components, 'outlet:', outlet);

  const routes = ['#/', '#/about', '#/skills', '#/experience', '#/education',
    '#/projects', '#/achievements', '#/services', '#/multimedia-works', '#/contact'];

  let passed = 0;
  let failed = 0;
  let projectsDead = false;

  for (const hash of routes) {
    if (projectsDead) {
      console.log('SKIP:', hash, '(previous route hung)');
      failed++;
      continue;
    }

    const name = hash.replace('#/', '') || 'Home';
    const start = Date.now();

    try {
      await page.evaluate((h) => { window.location.hash = h; }, hash);
      await new Promise(r => setTimeout(r, 1000));

      const result = await Promise.race([
        page.evaluate(() => {
          const outlet = document.getElementById('route-outlet');
          if (!outlet) return 'NO_OUTLET';
          const html = outlet.innerHTML;
          return 'OK:' + html.length;
        }),
        new Promise((_, reject) => setTimeout(() => reject('TIMEOUT'), 5000))
      ]);

      if (result.startsWith('OK:')) {
        const len = parseInt(result.split(':')[1]);
        if (len > 100) {
          console.log(`PASS ${name}: ${len} chars (${Date.now()-start}ms)`);
          passed++;
        } else {
          console.log(`FAIL ${name}: only ${len} chars`);
          failed++;
        }
      } else {
        console.log(`FAIL ${name}: ${result}`);
        failed++;
        if (name === 'Projects') projectsDead = true;
      }
    } catch (e) {
      console.log(`FAIL ${name}: ${e.message ? e.message.substring(0, 80) : e}`);
      failed++;
      if (name === 'Projects') projectsDead = true;
    }
  }

  console.log(`\nRESULTS: ${passed} passed, ${failed} failed`);
  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
})();
