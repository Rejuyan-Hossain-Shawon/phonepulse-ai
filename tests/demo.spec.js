
const { test, expect } = require('@playwright/test');

test('Interactive demo opens the PhonePulse dashboard', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/');

  await page.getByRole('button', {
    name: 'Explore interactive demo'
  }).click();

  await expect(
    page.getByRole('heading', { name: /Overview/i })
  ).toBeVisible();

  console.log('Demo dashboard opened successfully');
  console.log('Current URL:', page.url());

  console.log(
    'Navigation links:',
    await page.getByRole('link').allTextContents()
  );

  console.log(
    'Navigation buttons:',
    await page.getByRole('button').allTextContents()
  );
});

