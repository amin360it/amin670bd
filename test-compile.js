const puppeteer = require('puppeteer-core');

(async () => {
  const b = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const p = await b.newPage();
  p.on('console', m => console.log(m.type(), m.text().substring(0, 500)));

  await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  // Navigate to Projects to trigger the hang
  console.log('=== Navigating to Projects ===');
  
  try {
    await Promise.race([
      p.evaluate(() => {
        window.location.hash = '#/projects';
      }),
      new Promise((_, reject) => setTimeout(() => reject('EVAL_TIMEOUT'), 3000))
    ]);
    console.log('Hash changed');
    
    await new Promise(r => setTimeout(r, 2000));
    
    const status = await p.evaluate(() => {
      const outlet = document.getElementById('route-outlet');
      if (!outlet) return 'NO OUTLET';
      return 'OUTLET: ' + outlet.innerHTML.length;
    });
    console.log('Status:', status);
  } catch (e) {
    console.log('Error:', e.message || e);
  }

  await b.close();
})();
