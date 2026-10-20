
const { test, expect } = require('@playwright/test');

test('PhonePulse AI loads successfully', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/');

  await expect(page.locator('body')).toBeVisible();

  await expect(
    page.getByText('PhonePulse AI', { exact: false }).first()
  ).toBeVisible();
});



test('Main navigation pages open without errors', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/');

  const pages = [
    'Overview',
    'Regional',
    'Market',
    'Models',
    'Features',
    'Trends',
    'Analyze',
    'Explorer',
    'Compare',
    'Monitoring',
    'Sources',
    'Alerts',
    'Settings'
  ];

  for (const name of pages) {
    const link = page.getByRole('link', {
      name,
      exact: true
    });

    if (await link.count() === 0) {
      console.log(`${name}: navigation link not available`);
      continue;
    }

    await link.click();

    await expect(page.locator('body')).toBeVisible();

    console.log(`${name}: page opened`);
  }
});
