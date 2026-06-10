const puppeteer = require('puppeteer-core');

(async () => {
  const b = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const p = await b.newPage();
  p.on('console', m => {
    if (m.type() !== 'info')
      console.log(m.type(), m.text().substring(0, 400));
  });

  await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  // Compile the FULL ProjectsView template manually
  const result = await Promise.race([
    p.evaluate(() => {
      const tpl = window.tinyVueComponents.ProjectsView.template;
      const comp = window.tinyVueComponents.ProjectsView;
      const ctx = Object.assign({ DATA: window.DATA }, comp.data ? comp.data() : {});
      
      console.log('Template length:', tpl.length);
      const start = Date.now();
      
      const { _compileTemplate } = window.tinyVue;
      const res = _compileTemplate(tpl, ctx);
      
      const elapsed = Date.now() - start;
      console.log('Compiled in ' + elapsed + 'ms');
      return { elapsed, subs: res.subs.length };
    }),
    new Promise((_, reject) => setTimeout(() => reject('TIMEOUT after 10s'), 10000))
  ]);
  
  console.log('Result:', JSON.stringify(result));

  await b.close();
})();
