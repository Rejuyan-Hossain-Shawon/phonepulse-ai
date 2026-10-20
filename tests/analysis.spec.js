
const { test, expect } = require('@playwright/test');

test('Inspect smartphone analysis controls', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/');

  await page.getByRole('button', {
    name: 'Explore interactive demo'
  }).click();

  await page.getByRole('button', {
    name: 'Analyze',
    exact: true
  }).click();

  await expect(
    page.getByRole('heading', { name: /Analyze text/i })
  ).toBeVisible();

  console.log('INPUTS:', await page.locator('input').evaluateAll(
    elements => elements.map(el => ({
      type: el.type,
      placeholder: el.placeholder
    }))
  ));

  console.log('TEXTAREAS:', await page.locator('textarea').evaluateAll(
    elements => elements.map(el => ({
      placeholder: el.placeholder
    }))
  ));

  console.log('BUTTONS:', await page.getByRole('button').allTextContents());
});

