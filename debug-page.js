const puppeteer = require('puppeteer-core');

(async () => {
  const b = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const p = await b.newPage();
  p.on('console', m => console.log('CONSOLE:', m.type(), m.text()));
  p.on('pageerror', e => console.log('PAGE_ERR:', e.message));
  
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));
  
  const tinyVue = await p.evaluate(() => window.__tinyVue ? 'tinyVue loaded v' + window.__tinyVue.version : 'no tinyVue');
  console.log('TINYVUE:', tinyVue);
  
  const outlet = await p.evaluate(() => {
    const el = document.getElementById('route-outlet');
    return el ? 'FOUND route-outlet, HTML length: ' + el.innerHTML.length : 'NO route-outlet';
  });
  console.log('OUTLET:', outlet);
  
  const html = await p.content();
  const scripts = html.match(/<script[^>]*src="([^"]+)"[^>]*>/g) || [];
  console.log('SCRIPTS:', scripts.length);
  scripts.forEach(s => console.log('  ', s));
  
  const bodyText = await p.evaluate(() => document.body.innerText.substring(0, 300));
  console.log('BODY:', bodyText);
  
  await b.close();
})();
