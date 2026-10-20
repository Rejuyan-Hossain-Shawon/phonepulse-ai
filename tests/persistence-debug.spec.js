
const { test } = require('@playwright/test');

test('Inspect Explorer records', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/');

  await page.getByRole('button', {
    name: 'Explore interactive demo'
  }).click();

  await page.getByRole('button', {
    name: 'Explorer',
    exact: true
  }).click();

  console.log(
    'HEADINGS:',
    await page.getByRole('heading').allTextContents()
  );

  console.log(
    'INPUTS:',
    await page.locator('input').evaluateAll(elements =>
      elements.map(el => ({
        type: el.type,
        placeholder: el.placeholder
      }))
    )
  );

  console.log(
    'BUTTONS:',
    await page.getByRole('button').allTextContents()
  );

  console.log(
    'TABLES:',
    await page.locator('table').count()
  );
});
