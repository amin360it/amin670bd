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

  // Test innerHTML parsing of ProjectsView template
  const result = await Promise.race([
    p.evaluate(() => {
      const tpl = window.tinyVueComponents.ProjectsView.template;
      const start = Date.now();
      const div = document.createElement('div');
      div.innerHTML = tpl.trim();
      const parseTime = Date.now() - start;
      
      const count = (node) => {
        let c = 1;
        for (let i = 0; i < node.childNodes.length; i++) {
          c += count(node.childNodes[i]);
        }
        return c;
      };
      
      const walk = (node, depth) => {
        if (depth > 100) return;
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i];
          if (child.nodeType === 1) {
            const attrs = [];
            for (let j = 0; j < (child.attributes || []).length; j++) {
              attrs.push(child.attributes[j].name);
            }
            if (depth < 3) console.log(' '.repeat(depth*2) + child.tagName, attrs.join(','));
            walk(child, depth + 1);
          }
        }
      };
      
      console.log('ROOT:', div.firstElementChild.tagName);
      walk(div, 0);
      
      return {
        parseMs: parseTime,
        totalNodes: count(div),
        childNodes: div.childNodes.length,
        htmlLen: tpl.length
      };
    }),
    new Promise((_, reject) => setTimeout(() => reject('TIMEOUT after 5s'), 5000))
  ]);
  
  console.log('DOM analysis:', JSON.stringify(result));

  await b.close();
})();
