const puppeteer = require('puppeteer-core');

(async () => {
  const b = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const p = await b.newPage();
  
  p.on('console', m => console.log('CONSOLE', m.type(), m.text().substring(0, 300)));
  p.on('pageerror', e => console.log('PAGE_ERR:', e.message.substring(0, 300)));

  // Navigate to Home first
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('=== Now navigating to Projects (direct) ===');
  
  try {
    await p.evaluate(() => {
      console.log('Before hash change');
      window.location.hash = '#/projects';
      console.log('After hash change');
    });
    
    // Wait but with timeout
    await new Promise(r => setTimeout(r, 3000));
    
    const result = await Promise.race([
      p.evaluate(() => {
        const outlet = document.getElementById('route-outlet');
        if (!outlet) return 'No outlet';
        return 'Outlet HTML length: ' + outlet.innerHTML.length + ', text: ' + document.body.innerText.substring(0, 200).replace(/\n/g, ' ');
      }),
      new Promise((_, reject) => setTimeout(() => reject('TIMEOUT after 8s'), 8000))
    ]);
    console.log('RESULT:', result);
  } catch (e) {
    console.log('ERROR:', e);
  }
  
  await b.close();
})();
