const puppeteer = require('puppeteer-core');

(async () => {
  const b = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const p = await b.newPage();
  p.on('console', m => {
    if (m.type() === 'error') console.log('ERR:', m.text().substring(0, 500));
    if (m.text().includes('[tinyVue]')) console.log(m.text().substring(0, 300));
  });

  await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  // Get the ProjectsView template and compile halves
  const results = await p.evaluate(() => {
    const tpl = window.tinyVueComponents.ProjectsView.template;
    const midpoint = Math.floor(tpl.length / 2);
    // Find a good split point at a tag boundary
    const split1 = tpl.lastIndexOf('</div>', midpoint) + 6;
    const half1 = tpl.substring(0, split1);
    const half2 = tpl.substring(split1);

    const ctx = Object.assign({ DATA: window.DATA },
      window.tinyVueComponents.ProjectsView.data());

    const results = [];

    const test = (name, template) => {
      const start = Date.now();
      try {
        const r = window.tinyVue._compileTemplate(template, ctx);
        return 'OK ' + (Date.now() - start) + 'ms ' + r.subs.length + ' subs';
      } catch (e) {
        return 'ERR: ' + e.message;
      }
    };

    results.push('full: ' + test('full', tpl.substring(0, 400)));
    results.push('half1: ' + test('half1', half1));
    results.push('half2: ' + test('half2', half2));

    if (half1.length > 100) {
      const mid2 = Math.floor(half1.length / 2);
      const s1 = half1.lastIndexOf('</div>', mid2) + 6;
      results.push('half1a: ' + test('half1a', half1.substring(0, s1)));
      results.push('half1b: ' + test('half1b', half1.substring(s1)));
    }

    return results;
  });

  console.log('Results:');
  results.forEach(r => console.log('  ' + r));

  await b.close();
})();
