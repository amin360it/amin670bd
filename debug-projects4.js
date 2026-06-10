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
      console.log('CONSOLE', m.type(), m.text().substring(0, 400));
  });
  p.on('pageerror', e => console.log('PAGE_ERR:', e.message.substring(0, 400)));

  // Inject a test component and try compiling it
  await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  // Test: compile a minimal template to verify basic compilation works
  const test1 = await p.evaluate(() => {
    try {
      const { _compileTemplate } = window.tinyVue;
      const ctx = { DATA: window.DATA };
      const result = _compileTemplate('<div>hello</div>', ctx);
      return 'OK: ' + result.subs.length + ' subs';
    } catch(e) { return 'ERR: ' + e.message; }
  });
  console.log('Test1 (basic):', test1);

  // Test: compile the ProjectsView template directly
  const test2 = await p.evaluate(() => {
    try {
      const { _compileTemplate } = window.tinyVue;
      const comp = window.tinyVueComponents.ProjectsView;
      const template = comp.template; // already a string (joined in defineComponent)
      const ctx = Object.assign({ DATA: window.DATA }, comp.data ? comp.data() : {});
      console.log('[tinyVue] Manual ProjectsView compile start, template len:', template.length);
      const start = Date.now();
      const result = _compileTemplate(template, ctx);
      const elapsed = Date.now() - start;
      console.log('[tinyVue] Manual compile done in ' + elapsed + 'ms');
      return 'OK: ' + elapsed + 'ms, ' + result.subs.length + ' subs';
    } catch(e) { return 'ERR: ' + e.message; }
  });
  console.log('Test2 (ProjectsView template):', test2);

  await b.close();
})();
