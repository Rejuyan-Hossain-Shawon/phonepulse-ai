
const { test, expect } = require('@playwright/test');

const testCases = [
  {
    name: 'positive',
    review: 'I love the Samsung Galaxy S24. The camera is excellent and the battery is amazing.',
    expected: 'positive'
  },
  {
    name: 'negative',
    review: 'This phone is terrible. The battery is bad and the camera is awful.',
    expected: 'negative'
  },
  {
    name: 'neutral',
    review: 'The Samsung Galaxy S24 has a 6.2 inch display.',
    expected: 'neutral'
  }
];

for (const item of testCases) {
  test(`Analyze a ${item.name} smartphone review`, async ({ page }) => {

    // Open PhonePulse AI
    await page.goto('http://127.0.0.1:5173/');

    // Enter demo mode
    await page.getByRole('button', {
      name: 'Explore interactive demo'
    }).click();

    // Open Analyze page
    await page.getByRole('button', {
      name: 'Analyze',
      exact: true
    }).click();

    // Enter smartphone review
    await page.locator('textarea').fill(item.review);

    // Submit review
    await page.getByRole('button', {
      name: 'Analyze & save'
    }).click();

    // Verify result section
    await expect(
      page.getByRole('heading', { name: 'Latest result' })
    ).toBeVisible();

    // Verify expected sentiment
    await expect(
      page.getByText(item.expected, { exact: true }).first()
    ).toBeVisible();

    console.log(`${item.name.toUpperCase()} sentiment: PASS`);
  });
}
