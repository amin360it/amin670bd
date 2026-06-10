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

  const tests = [
    { name: 'basic div', tpl: '<div>hello</div>' },
    { name: 'v-if true', tpl: '<div><div v-if="true">hello</div></div>' },
    { name: 'v-for array', tpl: '<div><div v-for="i in [1,2,3]">{{i}}</div></div>' },
    { name: 'select v-model', tpl: '<div><select v-model="x"><option>a</option></select></div>' },
    { name: 'select + v-for options', tpl: '<div><select v-model="x"><option v-for="i in [1,2]" :value="i">{{i}}</option></select></div>' },
    { name: 'select + v-model + @change', tpl: '<div><select v-model="x" @change="f"><option v-for="i in [1,2]" :key="i" :value="i">{{i}}</option></select></div>' },
    { name: 'nested v-if', tpl: '<div><div v-if="true"><div v-if="true">deep</div></div></div>' },
    { name: 'class bind object', tpl: '<div :class="{ active: x, disabled: !x }">test</div>' },
    { name: 'complex filter', tpl: '<div><button v-for="cat in [{k:\'a\'}].concat([{k:\'b\'},{k:\'c\'}])" :key="cat.k">{{cat.k}}</button></div>' },
  ];

  for (const test of tests) {
    const result = await Promise.race([
      p.evaluate((tpl) => {
        const ctx = { DATA: { projectCategories: [{ key: 'web', name: 'Web' }] }, x: 'all', f() {} };
        const start = Date.now();
        window.tinyVue._compileTemplate(tpl, ctx);
        return 'OK ' + (Date.now() - start) + 'ms';
      }, test.tpl),
      new Promise((_, reject) => setTimeout(() => reject('TIMEOUT'), 3000))
    ]).catch(e => 'FAIL: ' + e);
    console.log(test.name + ':', result);
  }

  await b.close();
})();
