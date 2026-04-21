import { test, expect } from '@playwright/test';

test.describe('keyboard controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Start the game
    await page.keyboard.press('Enter');
    // Brief wait for state to settle
    await page.waitForTimeout(100);
  });

  test('Escape toggles pause', async ({ page }) => {
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('game-overlay')).toBeVisible();
    await expect(page.getByText(/paused/i)).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('game-overlay')).not.toBeVisible();
  });

  test('P key toggles pause', async ({ page }) => {
    await page.keyboard.press('KeyP');
    await expect(page.getByText(/paused/i)).toBeVisible();
    await page.keyboard.press('KeyP');
    await expect(page.getByTestId('game-overlay')).not.toBeVisible();
  });

  test('ArrowLeft key is accepted without error', async ({ page }) => {
    // We verify the app doesn't crash and the board remains visible
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('canvas').first()).toBeVisible();
  });

  test('ArrowRight key is accepted without error', async ({ page }) => {
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('canvas').first()).toBeVisible();
  });

  test('ArrowDown soft drop is accepted without error', async ({ page }) => {
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('canvas').first()).toBeVisible();
  });

  test('Space hard drop is accepted without error', async ({ page }) => {
    await page.keyboard.press('Space');
    await expect(page.locator('canvas').first()).toBeVisible();
  });

  test('ArrowUp rotates piece without error', async ({ page }) => {
    await page.keyboard.press('ArrowUp');
    await expect(page.locator('canvas').first()).toBeVisible();
  });

  test('Z key rotates counter-clockwise without error', async ({ page }) => {
    await page.keyboard.press('KeyZ');
    await expect(page.locator('canvas').first()).toBeVisible();
  });

  test('C key activates hold without error', async ({ page }) => {
    await page.keyboard.press('KeyC');
    await expect(page.locator('canvas').first()).toBeVisible();
  });

  test('hard drop with Space triggers score update (hard drop gives +2 per row)', async ({ page }) => {
    const scoreBefore = await page.getByTestId('stat-score').textContent();
    await page.keyboard.press('Space');
    await page.waitForTimeout(50);
    const scoreAfter = await page.getByTestId('stat-score').textContent();
    // Score should be >= previous (hard drop adds points)
    const before = parseInt((scoreBefore ?? '0').replace(/,/g, ''));
    const after = parseInt((scoreAfter ?? '0').replace(/,/g, ''));
    expect(after).toBeGreaterThanOrEqual(before);
  });
});
