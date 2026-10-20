
const { test, expect } = require('@playwright/test');

async function demo(page) {
  await page.goto('/');
  await page.getByRole('button', {
    name: 'Explore interactive demo'
  }).click();

  await expect(
    page.getByRole('heading', { name: /Overview/ })
  ).toBeVisible();
}

async function nav(page, name, heading) {
  await page.locator('nav')
    .getByRole('button', { name, exact: true })
    .click();

  await expect(page.locator('main h1')).toContainText(heading);
}

// TEST 01: All 13 pages
test('01 - demo login and all 13 pages render correct headings', async ({ page }) => {
  await demo(page);

  const pages = [
    ['Overview', 'Overview'],
    ['Regional', 'Regional intelligence'],
    ['Market', 'Sales & market share'],
    ['Models', 'Brands & models'],
    ['Features', 'Feature intelligence'],
    ['Trends', 'Trends & impactful models'],
    ['Analyze', 'Analyze text'],
    ['Explorer', 'Explorer'],
    ['Compare', 'Brand comparison'],
    ['Monitoring', 'Monitoring'],
    ['Sources', 'Data source manager'],
    ['Alerts', 'Alerts'],
    ['Settings', 'Settings']
  ];

  for (const [name, heading] of pages) {
    await test.step(name, () => nav(page, name, heading));
  }
});

// TEST 02: Sentiment analysis
test('02 - positive, negative and neutral sentiment analysis', async ({ page }) => {
  await demo(page);
  await nav(page, 'Analyze', 'Analyze text');

  const examples = [
    [
      'positive',
      'I love the Samsung Galaxy S24. The camera is excellent and the battery is amazing.'
    ],
    [
      'negative',
      'This phone is terrible. The battery is bad and the camera is awful.'
    ],
    [
      'neutral',
      'The Samsung Galaxy S24 has a 6.2 inch display.'
    ]
  ];

  for (const [sentiment, text] of examples) {
    await test.step(sentiment, async () => {
      await page.locator('textarea').fill(text);

      await page.getByRole('button', {
        name: 'Analyze & save'
      }).click();

      await expect(
        page.locator('.result .badge')
      ).toHaveText(sentiment);
    });
  }
});

// TEST 03: Explorer search
test('03 - Explorer search filters the visible records', async ({ page }) => {
  await demo(page);
  await nav(page, 'Explorer', 'Explorer');

  const search = page.getByPlaceholder('Search text or model...');

  await search.fill('PLAYWRIGHT_UNLIKELY_SEARCH_987654321');

  await expect(
    page.getByText('No matching records')
  ).toBeVisible();

  await expect(
    page.locator('table tbody tr')
  ).toHaveCount(0);

  await search.clear();

  await expect(
    page.getByRole('heading', { name: /Analyzed records/ })
  ).toBeVisible();
});

// TEST 04: Overview search
test('04 - Overview search updates the discussion count', async ({ page }) => {
  await demo(page);

  const search = page.getByPlaceholder('Search discussions');

  await search.fill('PLAYWRIGHT_UNLIKELY_SEARCH_987654321');

  const card = page.locator('.stat').filter({
    hasText: 'Analyzed discussions'
  });

  await expect(
    card.locator('strong')
  ).toHaveText('0');

  await search.clear();
});

// TEST 05: CSV export
test('05 - Overview and Explorer CSV export download', async ({ page }) => {
  await demo(page);

  let downloadPromise = page.waitForEvent('download');

  await page.getByRole('button', {
    name: 'Export',
    exact: true
  }).click();

  let file = await downloadPromise;

  expect(file.suggestedFilename()).toMatch(/\.csv$/i);

  await nav(page, 'Explorer', 'Explorer');

  downloadPromise = page.waitForEvent('download');

  await page.getByRole('button', {
    name: 'CSV export'
  }).click();

  file = await downloadPromise;

  expect(file.suggestedFilename()).toMatch(/\.csv$/i);
});

// TEST 06: Brand comparison
test('06 - Compare renders selected brands and rankings', async ({ page }) => {
  await demo(page);
  await nav(page, 'Compare', 'Brand comparison');

  await expect(
    page.getByRole('heading', {
      name: 'Model discussion ranking'
    })
  ).toBeVisible();

  const selectors = page.locator('.filters select');

  await expect(selectors).toHaveCount(2);

  await selectors.nth(0).selectOption({
    label: 'Samsung'
  });

  await selectors.nth(1).selectOption({
    label: 'Apple'
  });

  await expect(selectors.nth(0)).toHaveValue('Samsung');
  await expect(selectors.nth(1)).toHaveValue('Apple');
});

// TEST 07: Sources, Monitoring, Settings
test('07 - Sources, Monitoring and Settings controls are present', async ({ page }) => {
  await demo(page);

  await nav(page, 'Sources', 'Data source manager');

  await expect(
    page.getByRole('heading', {
      name: 'Import real smartphone reviews'
    })
  ).toBeVisible();

  await nav(page, 'Monitoring', 'Monitoring');

  await expect(
    page.getByRole('heading', {
      name: 'Add a YouTube monitor'
    })
  ).toBeVisible();

  await expect(
    page.getByPlaceholder('11-character video ID')
  ).toBeVisible();

  await nav(page, 'Settings', 'Settings');

  await expect(
    page.locator('main h1')
  ).toContainText('Settings');
});

// TEST 08: Logout
test('08 - logout returns to sign-in page', async ({ page }) => {
  await demo(page);

  // Click the account button in the sidebar.
  await page.getByRole('button', {
    name: /Demo Analyst/
  }).click();

  await expect(
    page.getByRole('heading', {
      name: 'Welcome back'
    })
  ).toBeVisible();
});

// TEST 09: Data persistence
test('09 - analyzed review is visible in Explorer after refresh', async ({ page }) => {
  await demo(page);
  await nav(page, 'Analyze', 'Analyze text');

  const marker = `PPTEST${Date.now()}`;

  await page.locator('textarea').fill(
    `Samsung Galaxy S24 camera is excellent ${marker}`
  );

  await page.getByRole('button', {
    name: 'Analyze & save'
  }).click();

  await expect(
    page.locator('.result')
  ).toContainText(marker);

  await nav(page, 'Explorer', 'Explorer');

  await page.getByPlaceholder(
    'Search text or model...'
  ).fill(marker);

  await expect(
    page.locator('table tbody')
  ).toContainText(marker);

  await page.reload();

  // After refresh, navigation resets to Overview.
  await nav(page, 'Explorer', 'Explorer');

  await page.getByPlaceholder(
    'Search text or model...'
  ).fill(marker);

  await expect(
    page.locator('table tbody')
  ).toContainText(marker);
});
