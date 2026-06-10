const puppeteer = require('puppeteer-core');

(async () => {
  const b = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const p = await b.newPage();

  // Track script loads
  const loadedScripts = [];
  p.on('response', resp => {
    if (resp.url().includes('.js')) {
      loadedScripts.push(resp.url() + ' -> ' + resp.status());
    }
  });

  p.on('console', m => console.log('CONSOLE', m.type(), m.text()));
  p.on('pageerror', e => console.log('PAGE_ERR:', e.message));

  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('\n=== LOADED SCRIPTS ===');
  loadedScripts.forEach(s => console.log('  ' + s));

  console.log('\n=== ERROR CHECK ===');
  const hasErr = await p.evaluate(() => {
    const errs = [];
    if (typeof App === 'undefined') errs.push('App is undefined');
    if (typeof window.tinyVueComponents === 'undefined') errs.push('tinyVueComponents is undefined');
    if (typeof window.__router === 'undefined') errs.push('__router is undefined');
    try {
      const outlet = document.getElementById('route-outlet');
      if (!outlet) errs.push('route-outlet not found');
      else if (outlet.children.length === 0) errs.push('route-outlet is empty');
    } catch(e) { errs.push(e.message); }
    return errs;
  });
  console.log('Errors:', hasErr);

  console.log('\n=== tinyVueComponents keys ===');
  const keys = await p.evaluate(() => window.tinyVueComponents ? Object.keys(window.tinyVueComponents) : 'undefined');
  console.log(keys);

  await b.close();
})();
