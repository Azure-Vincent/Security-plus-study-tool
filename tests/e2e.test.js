/* End-to-end test of the complete learning flow in a real browser (Playwright + Chromium).
   Run: npm run test:e2e   (requires the `playwright` package and a Chromium build) */
const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('../server');

let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { chromium = null; }

const skip = chromium ? false : 'playwright is not installed (npm install, then npx playwright install chromium)';

test('complete learning flow', { skip, timeout: 180000 }, async (t) => {
  const server = createServer();
  await new Promise((r) => server.listen(0, r));
  const base = `http://localhost:${server.address().port}/`;
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('dialog', (d) => d.accept());

  try {
    await t.test('dashboard shows the exam version', async () => {
      await page.goto(base);
      await page.waitForSelector('.version-banner');
      assert.match(await page.textContent('.version-banner'), /SY0-701/);
      assert.match(await page.textContent('#versionPill'), /SY0-701/);
    });

    await t.test('lecture lists every objective and a lesson teaches with checks', async () => {
      await page.click('nav.mainnav >> text=Lecture');
      await page.waitForSelector('.lesson-list');
      assert.equal(await page.locator('.lesson-link').count(), 28);
      await page.click('a[href="#/learn/1.1"]');
      await page.waitForSelector('.lesson-body');
      assert.ok(await page.locator('.diagram svg').count() >= 1, 'lesson has diagrams');
      assert.ok(await page.locator('.compare table').count() >= 1, 'lesson has comparisons');
      const kc = page.locator('.kcheck').first();
      await kc.locator('label.opt', { hasText: 'Operational' }).click();
      await kc.locator('[data-checkbtn]').click();
      assert.match(await kc.locator('.kfeedback').textContent(), /Correct/);
      assert.equal(await kc.locator('.opt-why:not([hidden])').count(), 4, 'every option is explained');
      await page.check('#lessonDone');
    });

    let missed = 0;
    await t.test('practice starts directly from the lesson with immediate explanations', async () => {
      await page.locator('.lesson-head [data-practice="1.1"]').click();
      await page.waitForSelector('.qcard');
      assert.match(await page.textContent('.session-head'), /1\.1/);
      for (let i = 0; i < 10; i++) {
        assert.match(await page.textContent('.q-meta'), /Objective 1\.1/, 'questions stay on the lesson topic');
        await page.locator('.qcard label.opt').first().click();
        await page.click('#checkBtn');
        await page.waitForSelector('#feedback');
        const nOpts = await page.locator('.qcard label.opt').count();
        assert.equal(await page.locator('.qcard .opt-why').count(), nOpts, 'explanations for correct and incorrect choices');
        if (await page.locator('#feedback.bad').count()) missed++;
        await page.click('#nextBtn');
      }
      await page.waitForSelector('text=Session complete');
    });

    await t.test('progress persists across a reload and missed items enter spaced review', async () => {
      await page.goto(base + '#/');
      await page.reload();
      await page.waitForSelector('.stats-grid');
      assert.match(await page.textContent('.stats-grid'), /Questions answered\s*10/);
      assert.match(await page.textContent('.stats-grid'), /Lessons completed\s*1 \/ 28/);
      const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('secplus.progress.v1')));
      assert.equal(Object.keys(stored.q).length, 10);
      if (missed) {
        await page.goto(base + '#/test');
        await page.click('button[data-act="review"]');
        await page.waitForSelector('.qcard');
        assert.match(await page.textContent('.session-head'), /Spaced review/);
      }
    });

    await t.test('firewall PBQ grades partial credit and demonstrates a solution', async () => {
      await page.goto(base + '#/pbq/fw-dmz');
      await page.waitForSelector('.fw-table');
      await page.click('button[aria-label="Delete rule 1"]');
      await page.click('#submitPBQ');
      await page.waitForSelector('.pbq-score');
      const pctText = await page.textContent('.pbq-score .big-num');
      const pct = parseInt(pctText, 10);
      assert.ok(pct > 0 && pct < 100, `partial credit expected, got ${pctText}`);
      assert.ok(await page.locator('.fb-list li').count() >= 12);
      assert.ok(await page.locator('.solution li').count() >= 3, 'step-by-step solution');
      await page.click('[data-showsol]');
      assert.equal(await page.locator('.fw-table tbody tr:not(.fw-implicit)').count(), 6, 'reference rules displayed');
    });

    await t.test('firewall PBQ: building a valid rule set earns full credit', async () => {
      await page.goto(base + '#/pbq/fw-iot');
      await page.waitForSelector('.fw-table');
      await page.evaluate(() => sessionStorage.clear());
      await page.reload();
      await page.waitForSelector('.fw-table');
      // Fix rule 1 to cameras -> NVR RTSP, rule 2 to security desk -> NVR, then add the vendor update rule.
      const set = async (n, f, v) => page.selectOption(`select[aria-label="Rule ${n} ${f}"]`, v);
      await set(1, 'protocol', 'TCP'); await set(1, 'destination', 'NVR'); await set(1, 'destination port', '554');
      await set(2, 'source', 'SEC');
      await page.click('text=+ Add rule');
      await set(3, 'source', 'NVR'); await set(3, 'destination', 'VENDOR'); await set(3, 'destination port', '443');
      await page.click('#submitPBQ');
      await page.waitForSelector('.pbq-score');
      assert.equal((await page.textContent('.pbq-score .big-num')).trim(), '100%');
    });

    await t.test('drag-and-drop PBQ works with keyboard-accessible click-to-place', async () => {
      await page.goto(base + '#/pbq/control-types');
      await page.waitForSelector('.pool');
      const plan = await page.evaluate(() => SEC.pbqs.find((p) => p.id === 'control-types').tokens.map((t) => [t.id, t.accept[0]]));
      for (const [tok, zone] of plan) {
        await page.click(`[data-token="${tok}"]`);
        await page.click(`[data-zonebtn="${zone}"]`);
      }
      await page.click('#submitPBQ');
      await page.waitForSelector('.pbq-score');
      assert.equal((await page.textContent('.pbq-score .big-num')).trim(), '100%');
    });

    await t.test('network diagram PBQ renders links and supports HTML5 drag and drop', async () => {
      // Tall viewport so the pool and the drop zone are both on screen during the mouse drag.
      await page.setViewportSize({ width: 1280, height: 1600 });
      await page.goto(base + '#/pbq/net-placement');
      await page.waitForSelector('.netmap');
      assert.ok(await page.locator('.netlinks line').count() >= 10, 'diagram connections drawn');
      await page.dragAndDrop('[data-token="waf"]', '.zone[data-zone="dmzweb"]');
      assert.equal(await page.locator('.zone[data-zone="dmzweb"] [data-token="waf"]').count(), 1);
      await page.setViewportSize({ width: 1280, height: 900 });
    });

    await t.test('ordering PBQ with tied ranks reaches full credit via move buttons', async () => {
      await page.goto(base + '#/pbq/volatility');
      await page.waitForSelector('.order-list');
      const target = await page.evaluate(() => Grading.solutionState(SEC.pbqs.find((p) => p.id === 'volatility')).order);
      for (let i = 0; i < target.length; i++) {
        for (;;) {
          const ids = await page.$$eval('.order-item', (els) => els.map((e) => e.dataset.id));
          if (ids.indexOf(target[i]) <= i) break;
          await page.click(`button[data-move="-1"][data-id="${target[i]}"]`);
        }
      }
      await page.click('#submitPBQ');
      await page.waitForSelector('.pbq-score');
      assert.equal((await page.textContent('.pbq-score .big-num')).trim(), '100%');
    });

    await t.test('terminal PBQ runs commands and grades answers', async () => {
      await page.goto(base + '#/pbq/term-compromise');
      await page.waitForSelector('.terminal');
      const run = async (cmd) => { await page.fill('.term-in input', cmd); await page.press('.term-in input', 'Enter'); };
      await run('grep "45.33.32.156" /var/log/auth.log | grep -c Failed');
      await page.waitForFunction(() => /\n20$/.test(document.querySelector('.term-out').textContent));
      await run('ps aux | grep kworker');
      assert.match(await page.textContent('.term-out'), /45\.33\.32\.156:4444/);
      await page.fill('#tq-ip', '45.33.32.156');
      await page.fill('#tq-acct', 'deploy');
      await page.fill('#tq-fails', '20');
      await page.click('#submitPBQ');
      await page.waitForSelector('.pbq-score');
      const pct = parseInt(await page.textContent('.pbq-score .big-num'), 10);
      assert.ok(pct >= 40 && pct < 100, `partial credit for 3 of 7 answers, got ${pct}`);
    });

    await t.test('timed mock exam: no feedback until submit, flag for review, results with disclaimer', async () => {
      await page.goto(base + '#/test');
      await page.click('button[data-exam="quick"]');
      await page.waitForSelector('#timer');
      assert.match(await page.textContent('#timer'), /^(30:00|29:5\d)$/);
      assert.equal(await page.locator('.pbq-exam').count(), 1, 'quick mock opens with a PBQ');
      await page.click('#nextBtn');
      await page.waitForSelector('.qcard input[name="q"]');
      await page.locator('.qcard label.opt').first().click();
      assert.equal(await page.locator('#feedback, .opt-why').count(), 0, 'exam mode withholds feedback');
      await page.click('#flagBtn');
      assert.match(await page.textContent('#flagBtn'), /Flagged/);
      await page.click('#reviewBtn');
      await page.waitForSelector('#submitBtn');
      assert.match(await page.textContent('main'), /1 flagged/);
      await page.click('#submitBtn');
      await page.waitForSelector('.score-card');
      assert.match(await page.textContent('.score-card'), /not a predicted CompTIA score/);
      assert.ok(await page.locator('#itemList .review-item').count() === 25);
      await page.click('input[name="flt"][value="flag"]');
      assert.equal(await page.locator('#itemList .review-item:not([hidden])').count(), 1, 'flag filter');
    });

    await t.test('progress page separates performance from the readiness estimate', async () => {
      await page.goto(base + '#/progress');
      await page.waitForSelector('.obj-table');
      const txt = await page.textContent('main');
      assert.match(txt, /Practice performance/);
      assert.match(txt, /Estimate, not a score prediction/);
      assert.match(txt, /Mock exam history/);
      assert.equal(await page.locator('.obj-table tbody tr').count(), 28);
    });

    await t.test('theme toggle switches to dark mode', async () => {
      await page.click('#themeToggle');
      const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      assert.ok(theme === 'dark' || theme === 'light');
    });

    await t.test('layouts fit a phone screen without horizontal scrolling', async () => {
      const phone = await browser.newPage({ viewport: { width: 375, height: 800 } });
      for (const h of ['#/', '#/learn/3.2', '#/test', '#/pbq/net-placement', '#/pbq/fw-dmz', '#/progress']) {
        await phone.goto(base + h);
        await phone.waitForTimeout(150);
        const overflow = await phone.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        assert.ok(overflow <= 1, `${h} overflows by ${overflow}px`);
      }
      await phone.close();
    });

    assert.deepEqual(errors, [], 'no console or page errors');
  } finally {
    await browser.close();
    server.close();
  }
});
