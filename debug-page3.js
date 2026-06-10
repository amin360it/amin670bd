const puppeteer = require('puppeteer-core');

(async () => {
  const b = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const p = await b.newPage();
  p.on('console', m => {
    if (m.type() === 'error' || m.type() === 'warning')
      console.log('CONSOLE', m.type(), m.text());
  });
  p.on('pageerror', e => console.log('PAGE_ERR:', e.message));

  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  const domState = await p.evaluate(() => {
    const app = document.querySelector('#app');
    const outlet = document.getElementById('route-outlet');
    return {
      appExists: !!app,
      appChildren: app ? app.children.length : -1,
      appInnerHTML: app ? app.innerHTML.substring(0, 500) : 'N/A',
      outletExists: !!outlet,
      outletChildren: outlet ? outlet.children.length : -1,
      bodyChildren: document.body.children.length,
      tinyVueLoaded: !!window.tinyVue,
      routerExists: !!window.__router,
      appInstanceExists: !!(window.__tinyVue && window.__tinyVue.appInstance)
    };
  });

  console.log('DOM State:', JSON.stringify(domState, null, 2));

  await b.close();
})();
