
const { test } = require('@playwright/test');

test('Inspect PhonePulse navigation', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/');

  console.log('CURRENT URL:', page.url());

  console.log('LINKS:', await page.getByRole('link').allTextContents());

  console.log('BUTTONS:', await page.getByRole('button').allTextContents());

  console.log('HEADINGS:', await page.getByRole('heading').allTextContents());
});
