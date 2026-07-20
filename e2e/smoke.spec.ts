import { expect, test } from '@playwright/test';

const waitForIsland = async (page: import('@playwright/test').Page) => {
  await expect(page.locator('astro-island').first()).not.toHaveAttribute('ssr');
};

test('Thai learning path and hand explorer work', async ({ page }) => {
  await page.goto('/basics/hand-rankings/');
  await expect(page.getByRole('heading', { name: 'อันดับไพ่', exact: true })).toBeVisible();
  await waitForIsland(page);
  await page.getByRole('button', { name: /หนึ่งคู่/ }).click();
  await expect(page.getByText('หนึ่งคู่', { exact: true }).last()).toBeVisible();
});

test('minimum raise gives immediate feedback', async ({ page }) => {
  await page.goto('/betting/min-bet-raise/');
  await waitForIsland(page);
  const input = page.getByLabel('ฉันจะเรสเป็น');
  await input.fill('30');
  await expect(page.getByText(/ต้องเรสเป็นอย่างน้อย/)).toBeVisible();
  await input.fill('40');
  await expect(page.getByText(/ถูกกติกา/)).toBeVisible();
});

test('all-in runs to showdown', async ({ page }) => {
  await page.goto('/playground/');
  await waitForIsland(page);
  await page.getByRole('button', { name: 'All-in' }).click();
  await expect(page.getByText(/ชนะด้วย/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'เล่นมือใหม่' })).toBeVisible();

  const table = await page.locator('.sim-table').boundingBox();
  const board = await page.locator('.sim-board').boundingBox();
  const topPlayer = await page.locator('.sim-0').boundingBox();
  expect(table).not.toBeNull();
  expect(board).not.toBeNull();
  expect(topPlayer).not.toBeNull();
  expect(Math.abs((board!.x + board!.width / 2) - (table!.x + table!.width / 2))).toBeLessThan(2);
  expect(Math.abs((board!.y + board!.height / 2) - (table!.y + table!.height / 2))).toBeLessThan(2);
  expect(topPlayer!.y + topPlayer!.height).toBeLessThan(board!.y);
});

test('side pots update from real commitments', async ({ page }) => {
  await page.goto('/showdown/side-pots/');
  await waitForIsland(page);
  await expect(page.getByText('Main pot', { exact: true })).toBeVisible();
  await expect(page.getByText('Side pot 1', { exact: true })).toBeVisible();
});
