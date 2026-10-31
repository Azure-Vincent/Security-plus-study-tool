/* End-to-end test of the complete study flow in a real browser (Playwright + Chromium).
   Run: npm run test:e2e   (requires the `playwright` package and a Chromium build)
   E2E_BASE_URL tests an already-running build (e.g. a desktop package) instead of the dev server. */
const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('../server');

let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { chromium = null; }
const skip = chromium ? false : 'playwright is not installed (npm install, then npx playwright install chromium)';

test('complete study flow', { skip, timeout: 240000 }, async (t) => {
  const server = process.env.E2E_BASE_URL ? null : createServer();
  if (server) await new Promise((r) => server.listen(0, r));
  const base = process.env.E2E_BASE_URL || `http://localhost:${server.address().port}/`;
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('dialog', (d) => d.accept());
  const text = (sel) => page.textContent(sel);

  try {
    await t.test('Today shows the goal, a one-click practice start and the exam version', async () => {
      await page.goto(base);
      await page.evaluate(() => localStorage.clear());
      await page.reload();
      await page.waitForSelector('.start-main');
      assert.match(await text('.today-top'), /0\s*of 20/);
      assert.match(await text('.version-note summary'), /SY0-701/);
      assert.equal(await page.locator('#railNav a').count(), 4, 'four destinations');
    });

    await t.test('Lesson: reading view with checks, then practice straight from the lesson', async () => {
      await page.click('#railNav a[href="#/learn"]');
      await page.waitForSelector('.rows');
      assert.equal(await page.locator('.domain .rowlink').count(), 28);
      await page.click('a[href="#/learn/1.1"]');
      await page.waitForSelector('.lesson-body');
      assert.ok(await page.locator('.diagram svg').count() >= 1);
      assert.ok(await page.locator('.compare table').count() >= 1);
      const kc = page.locator('.kcheck').first();
      await kc.locator('label.opt', { hasText: 'Operational' }).click();
      await kc.locator('[data-checkbtn]').click();
      assert.match(await kc.locator('.kfeedback').textContent(), /Correct/);
      assert.equal(await kc.locator('.why:not([hidden])').count(), 4, 'every option explained');
      await page.check('#lessonDone');
      await page.locator('.lesson-head [data-practice="1.1"]').click();
      await page.waitForSelector('.opt');
      assert.ok(await page.evaluate(() => document.body.classList.contains('focus')), 'focus mode hides navigation');
    });

    let missed = 0;
    await t.test('Practice session works entirely from the keyboard, with explanations', async () => {
      for (let i = 0; i < 10; i++) {
        assert.match(await text('.qmeta'), /^1\.1/, 'stays on the lesson topic');
        const multi = await page.locator('.opt.multi').count();
        await page.keyboard.press('1');
        if (multi) await page.keyboard.press('2');
        await page.keyboard.press('Enter');
        await page.waitForSelector('#feedback');
        assert.equal(await page.locator('.opt .why').count(), await page.locator('.opt').count(), 'every option explained');
        if (await page.locator('#feedback.bad').count()) missed++;
        assert.match(await text('.srs-note'), /back in|review in|returns only/i, 'feedback says when the question returns');
        if (i === 0 && await page.locator('[data-regrade="0"]').count()) {
          await page.keyboard.press('g');
          await page.waitForSelector('[data-regrade="0"][aria-pressed="true"]');
          assert.match(await text('.srs-note'), /10 min/, 'a guess comes back soon');
          await page.keyboard.press('g');
          await page.waitForSelector('[data-regrade="0"][aria-pressed="false"]');
        }
        await page.keyboard.press('Enter');
      }
      await page.waitForSelector('text=By objective');
      assert.match(await text('.summary-score'), /\/10/);
    });

    await t.test('Progress persists across reload; the daily goal updates; due items appear as the daily review', async () => {
      await page.goto(base + '#/');
      await page.reload();
      await page.waitForSelector('.today-top');
      assert.match(await text('.today-top'), /10\s*of 20/);
      const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('secplus.progress.v1')));
      assert.equal(Object.keys(stored.q).length, 10);
      assert.ok(stored.lessons['1.1'].done);
      assert.ok(Object.values(stored.q).every((r) => r.srs && r.srs.due > Date.now()), 'every answer is scheduled for later');
      assert.equal(await page.locator('.start-main [data-act="review"]').count(), 0, 'nothing due yet');
      // Jump two days ahead by moving every due time back.
      await page.evaluate(() => { Object.values(Store.data.q).forEach((r) => { r.srs.due -= 2 * 86400000; }); Store.save(); });
      await page.reload();
      await page.waitForSelector('.start-main [data-act="review"]');
      assert.match(await text('.start-main'), /10 questions due/);
      await page.click('.start-main [data-act="review"]');
      await page.waitForSelector('.opt');
      assert.match(await text('.sbar'), /Daily review/);
      assert.ok(missed >= 0);
    });

    await t.test('Try a similar question after a miss, and endless drill keeps going', async () => {
      await page.goto(base + '#/practice');
      await page.click('.tile [data-drill=""]');
      await page.waitForSelector('.opt');
      for (let i = 0; i < 7; i++) {
        await page.locator('.opt').first().click();
        if (await page.locator('.opt.multi').count()) await page.locator('.opt').nth(1).click();
        await page.click('#checkBtn');
        await page.waitForSelector('#feedback');
        if (await page.locator('#similarBtn').count()) {
          const before = await page.evaluate(() => Store.data.practice.qids.length);
          await page.click('#similarBtn');
          await page.waitForSelector('.opt input:not(:disabled)');
          assert.equal(await page.evaluate(() => Store.data.practice.qids.length), before + 1);
        } else {
          await page.click('#nextBtn');
        }
      }
      assert.match(await text('.sbar .count'), /7 answered/, 'drill extends past the first batch');
      await page.click('#endBtn');
      await page.waitForSelector('text=By objective');
    });

    await t.test('Flashcards flip and grade from the keyboard', async () => {
      await page.goto(base + '#/');
      await page.click('.alt[data-cards]');
      await page.waitForSelector('#card');
      await page.keyboard.press(' ');
      await page.waitForSelector('#knew');
      assert.equal(await page.locator('.grade-row .grade').count(), 4, 'Again, Hard, Good and Easy');
      assert.match(await text('#knew'), /1 day/, 'each button shows when the card returns');
      await page.keyboard.press('3');
      await page.keyboard.press(' ');
      await page.keyboard.press('1');
      assert.match(await text('.sbar .count'), /Card 3 of 21/, 'a missed card goes back in the deck');
      const cards = await page.evaluate(() => Store.data.cards);
      assert.equal(Object.keys(cards).length, 2);
      const ivls = Object.values(cards).map((c) => c.srs.ivl).sort();
      assert.deepEqual(ivls, [0, 1]);
    });

    await t.test('Topic picker starts a filtered session', async () => {
      await page.goto(base + '#/practice');
      await page.click('#topics details:nth-of-type(4) summary');
      await page.check('input[name="obj"][value="4.6"]');
      await page.check('input[name="n"][value="5"]', { force: true });
      await page.click('#topicForm button[type="submit"]');
      await page.waitForSelector('.opt');
      assert.match(await text('.sbar .count'), /of 5/);
      assert.match(await text('.qmeta'), /^4\.6/);
    });

    await t.test('Firewall lab: partial credit, then a valid rule set earns full credit', async () => {
      await page.goto(base + '#/pbq/fw-dmz');
      await page.waitForSelector('.fw-table');
      await page.click('button[aria-label="Delete rule 1"]');
      await page.click('#submitPBQ');
      const pct = parseInt(await text('.pbq-score .big-num'), 10);
      assert.ok(pct > 0 && pct < 100, 'partial credit');
      assert.ok(await page.locator('.solution li').count() >= 3, 'step-by-step solution');
      await page.click('[data-showsol]');
      assert.equal(await page.locator('.fw-table tbody tr:not(.fw-implicit)').count(), 6);

      await page.goto(base + '#/pbq/fw-iot');
      await page.evaluate(() => sessionStorage.clear());
      await page.reload();
      await page.waitForSelector('.fw-table');
      const set = (n, f, v) => page.selectOption(`select[aria-label="Rule ${n} ${f}"]`, v);
      await set(1, 'protocol', 'TCP'); await set(1, 'destination', 'NVR'); await set(1, 'destination port', '554');
      await set(2, 'source', 'SEC');
      await page.click('text=+ Add rule');
      await set(3, 'source', 'NVR'); await set(3, 'destination', 'VENDOR'); await set(3, 'destination port', '443');
      await page.click('#submitPBQ');
      assert.equal((await text('.pbq-score .big-num')).trim(), '100%');
    });

    await t.test('Drag-and-drop labs: click-to-place and mouse drag', async () => {
      await page.goto(base + '#/pbq/control-types');
      await page.waitForSelector('.pool');
      const plan = await page.evaluate(() => SEC.pbqs.find((p) => p.id === 'control-types').tokens.map((t) => [t.id, t.accept[0]]));
      for (const [tok, zone] of plan) { await page.click(`[data-token="${tok}"]`); await page.click(`[data-zonebtn="${zone}"]`); }
      await page.click('#submitPBQ');
      assert.equal((await text('.pbq-score .big-num')).trim(), '100%');
      await page.setViewportSize({ width: 1280, height: 1700 });
      await page.goto(base + '#/pbq/net-placement');
      await page.waitForSelector('.netmap');
      assert.ok(await page.locator('.netlinks line').count() >= 10);
      await page.dragAndDrop('[data-token="waf"]', '.zone[data-zone="dmzweb"]');
      assert.equal(await page.locator('.zone[data-zone="dmzweb"] [data-token="waf"]').count(), 1);
      await page.setViewportSize({ width: 1280, height: 900 });
    });

    await t.test('Ordering and terminal labs', async () => {
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
      assert.equal((await text('.pbq-score .big-num')).trim(), '100%');
      await page.goto(base + '#/pbq/term-compromise');
      await page.fill('.term-in input', 'grep "45.33.32.156" /var/log/auth.log | grep -c Failed');
      await page.press('.term-in input', 'Enter');
      await page.waitForFunction(() => /\n20$/.test(document.querySelector('.term-out').textContent));
      await page.fill('#tq-ip', '45.33.32.156'); await page.fill('#tq-acct', 'deploy'); await page.fill('#tq-fails', '20');
      await page.click('#submitPBQ');
      const pct = parseInt(await text('.pbq-score .big-num'), 10);
      assert.ok(pct >= 40 && pct < 100);
    });

    await t.test('Every lab opens, grades, and shows a step-by-step solution', async () => {
      const ids = await page.evaluate(() => SEC.pbqs.map((p) => p.id));
      assert.ok(ids.length >= 21);
      for (const id of ids) {
        await page.goto(base + '#/pbq/' + id);
        await page.waitForSelector('#submitPBQ');
        await page.click('#submitPBQ');
        await page.waitForSelector('.pbq-score');
        assert.ok(await page.locator('.solution li').count() >= 2, `${id} shows a solution`);
        await page.click('[data-showsol]');
      }
    });

    await t.test('Acronym deck and acronym quizzes', async () => {
      await page.goto(base + '#/practice');
      await page.click('[data-cards="acronyms"]');
      await page.waitForSelector('#card');
      assert.match(await text('.sbar .title'), /Acronyms/);
      const isAcronym = await page.evaluate(() => { const id = Store.data.flash.ids[0]; return SEC.terms.find((t) => t.id === id).acronym === true; });
      assert.ok(isAcronym, 'deck contains acronym cards');
      // An acronym quiz renders as a normal practice question with its own tag.
      await page.evaluate(() => { const q = SEC.termQuestions.find((x) => x.acr); Store.data.practice = { id: 1, mode: 'practice', title: 'Acronym check', qids: [q.id], idx: 0, answers: {}, orders: { [q.id]: [0, 1, 2, 3] }, back: '#/practice', endless: false, pool: 'all', done: false }; Store.save(); });
      await page.goto(base + '#/session');
      await page.waitForSelector('.opt');
      assert.match(await text('.qmeta'), /Acronym quiz/);
      assert.match(await text('.qtext'), /^What does .+ stand for\?/);
    });

    await t.test('Timed mock exam: no feedback, flagging, review screen, results with disclaimer', async () => {
      await page.goto(base + '#/practice');
      await page.click('button[data-exam="quick"]');
      await page.waitForSelector('#timer');
      assert.match(await text('#timer'), /^(30:00|29:5\d)$/);
      await page.click('#nextBtn');
      await page.waitForSelector('.opt input');
      await page.keyboard.press('1');
      assert.equal(await page.locator('#feedback, .why').count(), 0, 'exam mode withholds feedback');
      await page.keyboard.press('f');
      assert.match(await text('#flagBtn'), /Flagged/);
      await page.click('#reviewBtn');
      assert.match(await text('main'), /1 flagged/);
      await page.click('#submitBtn');
      await page.waitForSelector('.summary-score');
      assert.match(await text('main'), /not a predicted CompTIA score/);
      assert.equal(await page.locator('#itemList .review-item').count(), 25);
      await page.check('input[name="flt"][value="flag"]', { force: true });
      assert.equal(await page.locator('#itemList .review-item:not([hidden])').count(), 1);
    });

    await t.test('Progress separates scores from the readiness estimate', async () => {
      await page.goto(base + '#/progress');
      const body = await text('main');
      assert.match(body, /By objective/);
      assert.match(body, /Readiness estimate/);
      assert.match(body, /not a CompTIA score/);
      assert.equal(await page.locator('.obj-table tbody tr').count(), 28);
      assert.ok(await page.locator('.heat i').count() >= 106);
    });

    await t.test('Settings: theme, text size and daily goal persist', async () => {
      await page.click('.rail [data-open-settings]');
      await page.check('#settings input[name="theme"][value="sepia"]', { force: true });
      await page.check('#settings input[name="text"][value="l"]', { force: true });
      await page.check('#settings input[name="goal"][value="30"]', { force: true });
      await page.check('#settings input[name="srs"][value="missed"]', { force: true });
      const exam = new Date(Date.now() + 20 * 86400000).toISOString().slice(0, 10);
      await page.fill('#examDate', exam);
      await page.waitForSelector('#clearExam');
      assert.equal(await page.evaluate(() => Store.data.settings.examDate), exam);
      assert.equal(await page.evaluate(() => Store.srsMode()), 'missed');
      await page.keyboard.press('Escape');
      await page.reload();
      await page.waitForSelector('.stats');
      assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'sepia');
      assert.equal(await page.evaluate(() => document.documentElement.dataset.text), 'l');
      await page.goto(base + '#/');
      assert.match(await text('.today-top'), /of 30/);
      assert.match(await text('.today-top'), /exam is in (19|20|21) days/i);
    });

    await t.test('Phone layout: bottom tabs and no sideways scrolling', async () => {
      const phone = await browser.newPage({ viewport: { width: 375, height: 800 }, hasTouch: true });
      for (const h of ['#/', '#/learn', '#/learn/3.2', '#/practice', '#/pbq/net-placement', '#/pbq/fw-dmz', '#/progress', '#/about']) {
        await phone.goto(base + h);
        await phone.waitForTimeout(120);
        const overflow = await phone.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        assert.ok(overflow <= 1, `${h} overflows by ${overflow}px`);
      }
      assert.ok(await phone.locator('.tabs a').first().isVisible(), 'bottom tab bar visible');
      assert.ok(!(await phone.locator('.rail').isVisible()), 'rail hidden on phones');
      await phone.close();
    });

    assert.deepEqual(errors, [], 'no console or page errors');
  } finally {
    await browser.close();
    if (server) server.close();
  }
});
