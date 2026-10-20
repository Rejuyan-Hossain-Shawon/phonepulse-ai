
const { test, expect } = require('@playwright/test');

test('All 13 workspace pages open correctly', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/');

  await page.getByRole('button', {
    name: 'Explore interactive demo'
  }).click();

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
    await test.step(`Open ${name}`, async () => {
      const navigationButton = page.getByRole('button', {
        name,
        exact: true
      });

      await expect(navigationButton).toBeVisible();
      await navigationButton.click();

      const headings = await page.getByRole('heading').allTextContents();

      console.log(`${name}:`, headings);

      // Check that navigation did not lead to an empty page.
      await expect(page.locator('main')).toBeVisible();
      await expect(page.getByRole('heading').first()).toBeVisible();
    });
  }
});
