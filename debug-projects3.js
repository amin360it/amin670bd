const puppeteer = require('puppeteer-core');

(async () => {
  const b = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const p = await b.newPage();

  p.on('console', m => console.log('CONSOLE', m.type(), m.text().substring(0, 500)));
  p.on('pageerror', e => console.log('PAGE_ERR:', e.message.substring(0, 500)));

  // Load the app at the root first (no hash)
  await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 3000));

  console.log('\n=== Navigate to Projects ===');
  
  // Use addScriptTag to inject a navigation call and capture logs
  const result = await p.evaluate(() => {
    // Clear console and navigate
    console.log('NAV START');
    window.location.hash = '#/projects';
    console.log('NAV DONE');
    return 'navigated';
  });
  console.log('Evaluate returned:', result);
  
  await new Promise(r => setTimeout(r, 5000));
  
  const state = await p.evaluate(() => {
    const outlet = document.getElementById('route-outlet');
    if (!outlet) return 'NO OUTLET';
    return 'OUTLET: ' + outlet.innerHTML.length + ' chars';
  });
  console.log('State:', state);

  await b.close();
})();
