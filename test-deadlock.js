const puppeteer = require('puppeteer-core');

(async () => {
  const b = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const p = await b.newPage();
  p.on('console', m => console.log(m.type(), m.text().substring(0, 400)));

  // Inject a watchdog BEFORE loading the page
  // This will detect if the main thread is blocked for more than 2 seconds
  await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  // Monkey-patch _compileTemplate to add a 3-second timeout
  const result = await p.evaluate(() => {
    const origCompile = window.tinyVue._compileTemplate;
    window.tinyVue._compileTemplate = function(tpl, ctx) {
      const start = Date.now();
      // Check every 50ms if we've been compiling for too long
      const interval = setInterval(() => {
        if (Date.now() - start > 3000) {
          console.error('COMPILE_HANG: template compilation exceeded 3s, length:', tpl.length);
          clearInterval(interval);
        }
      }, 50);
      try {
        const result = origCompile.call(this, tpl, ctx);
        clearInterval(interval);
        console.log('Compile OK:', tpl.length, 'chars,', result.subs.length, 'subs,', Date.now()-start, 'ms');
        return result;
      } catch(e) {
        clearInterval(interval);
        throw e;
      }
    };
    return 'patched';
  });
  console.log('Patch:', result);

  // Now navigate to Projects
  console.log('\n=== Navigating to Projects ===');
  try {
    await Promise.race([
      p.evaluate(() => { window.location.hash = '#/projects'; }),
      new Promise((_, reject) => setTimeout(() => reject('HASH_CHANGE_TIMEOUT'), 5000))
    ]);
    console.log('Hash change done');
    
    await new Promise(r => setTimeout(r, 5000));
    
    const status = await p.evaluate(() => {
      const outlet = document.getElementById('route-outlet');
      return outlet ? 'OK: ' + outlet.innerHTML.length + ' chars' : 'NO OUTLET';
    });
    console.log('Status:', status);
  } catch(e) {
    console.log('Error:', e.message || e);
  }

  await b.close();
})();
