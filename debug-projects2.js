const puppeteer = require('puppeteer-core');

(async () => {
  const b = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const p = await b.newPage();

  p.on('console', m => console.log('CONSOLE', m.type(), m.text().substring(0, 400)));
  p.on('pageerror', e => console.log('PAGE_ERR:', e.message.substring(0, 400)));

  // Navigate directly to Projects (via hash in URL)
  console.log('=== Navigating to Projects ===');
  await p.goto('http://localhost:3000/#/projects', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 3000));

  const result = await p.evaluate(() => {
    const outlet = document.getElementById('route-outlet');
    if (!outlet) return 'No outlet';
    return 'Outlet HTML length: ' + outlet.innerHTML.length + ', text: ' + document.body.innerText.substring(0, 300).replace(/\n/g, ' ');
  });
  console.log('RESULT:', result);

  await b.close();
})();
