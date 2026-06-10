const puppeteer = require('puppeteer-core');

(async () => {
  const b = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const p = await b.newPage();
  p.on('console', m => console.log(m.type(), m.text().substring(0, 300)));

  await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  // Simulate ProjectsView context
  const result = await p.evaluate(() => {
    const comp = window.tinyVueComponents.ProjectsView;
    const inst = window.tinyVue.createComponentInstance(comp);
    
    // Collect all expressions from the template
    const tpl = comp.template;
    const exprs = [];
    
    // Find {{ expr }}
    const mustacheRe = /\{\{\s*(.*?)\s*\}\}/g;
    let m;
    while ((m = mustacheRe.exec(tpl)) !== null) exprs.push(m[1]);
    
    // Find v-if="expr"
    const vifRe = /v-if="([^"]+)"/g;
    while ((m = vifRe.exec(tpl)) !== null) exprs.push(m[1]);
    
    // Find v-for expressions
    const vforRe = /v-for="([^"]+)"/g;
    while ((m = vforRe.exec(tpl)) !== null) {
      const parts = m[1].match(/\s+in\s+(.+)$/);
      if (parts) exprs.push(parts[1]);
    }
    
    // Find :bind expressions
    const bindRe = /:(\w+)="([^"]+)"/g;
    while ((m = bindRe.exec(tpl)) !== null) exprs.push(m[2]);
    
    // Find @event handlers
    const eventRe = /@(\w+(?:\.\w+)*)="([^"]+)"/g;
    while ((m = eventRe.exec(tpl)) !== null) exprs.push(m[2]);
    
    // Find v-model
    const modelRe = /v-model="([^"]+)"/g;
    while ((m = modelRe.exec(tpl)) !== null) exprs.push(m[1]);
    
    // Find ${} in attributes
    const dollarRe = /\$\{(.*?)\}/g;
    while ((m = dollarRe.exec(tpl)) !== null) exprs.push(m[1]);
    
    const results = [];
    for (const expr of [...new Set(exprs)]) {
      const fn = window.tinyVue._compileTemplate._compileExpr 
        || window.tinyVue._compileTemplate;
      const start = Date.now();
      try {
        // Compile and evaluate the expression 
        const compiled = new Function('$data', '$router', 
          'with($data||{}){try{return (' + expr + ')}catch(e){return undefined}}');
        compiled(inst, null);
        const elapsed = Date.now() - start;
        results.push({ expr: expr.substring(0, 60), time: elapsed });
        if (elapsed > 100) results.push('*** SLOW ***');
      } catch (e) {
        results.push({ expr: expr.substring(0, 60), error: e.message.substring(0, 60) });
      }
    }
    
    return results;
  });

  result.forEach(r => {
    if (r.time !== undefined) console.log(r.time + 'ms:', r.expr);
    else if (r.error) console.log('ERR:', r.expr, '-', r.error);
    else console.log(r);
  });

  await b.close();
})();
