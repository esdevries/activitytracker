import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:9000/activities');
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(/Activity Tracker/);
});

test('has example data', async ({ page }) => {
  await page.locator('a').filter({ hasText: 'Activities2 activities' }).click();
  await expect(page.locator('#q-app')).toContainText('Swimming');
  await expect(page.getByRole('link', { name: 'Going for a swim in the' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'A fun run competition against' })).toBeVisible();
  await expect(page.locator('#q-app')).toContainText('Running competition');
  await expect(page.locator('#q-app')).toContainText('A fun run competition against top athletes (Bear, panther, puma)');
});

test('can edit activity (persists after refresh)', async ({ page }) => {
  await page.getByRole('link', { name: 'Going for a swim in the' }).click();
  await expect(page.getByRole('paragraph')).toContainText('Going for a swim in the middle of the pacific ocean.');
  await expect(page.getByRole('strong')).toContainText('Swimming');
  await page.locator('button').filter({ hasText: 'edit' }).click();
  await page.getByLabel('Name').click();
  await page.getByLabel('Name').fill('Going Mountain Biking');
  await page.getByLabel('Description').click();
  await page.getByLabel('Description').fill('Going for a ride to the mount everest, Should be safe and fine');
  await page.getByText('scheduleTime tracking0 recent').click();
  await page.locator('a').filter({ hasText: 'Activities2 activities' }).click();
  await expect(page.getByRole('link', { name: 'A fun run competition against' })).toBeVisible();
  await expect(page.locator('#q-app')).toContainText('Going Mountain Biking');
  await expect(page.locator('#q-app')).toContainText('Going for a ride to the mount everest, Should be safe and fine');
  await page.getByRole('link', { name: 'Going for a ride to the mount' }).click();
  await expect(page.getByText('Going Mountain Biking')).toBeVisible();
  await expect(page.getByText('Going for a ride to the mount')).toBeVisible();
  await page.reload();
  await page.locator('a').filter({ hasText: 'Activities2 activities' }).click();
  await page.getByRole('link', { name: 'Going for a ride to the mount' }).click();
  await expect(page.getByText('Going Mountain Biking')).toBeVisible();
  await expect(page.getByText('Going for a ride to the mount')).toBeVisible();
  await page.getByText('scheduleTime tracking0 recent').click();
  await page.getByRole('link').click();
  await expect(page.locator('#q-app')).toContainText('Going Mountain Biking');
});

test('can add activity (persists after refresh)', async ({ page }) => {
  await page.locator('button').filter({ hasText: 'add' }).click();
  await page.getByLabel('Name').click();
  await page.getByLabel('Name').fill('Golfing with Midgets');
  await page.getByLabel('Name').press('Tab');
  await page.getByLabel('Description').fill('Add a whole new meaning to midget golfing.');
  await page.locator('a').filter({ hasText: 'Activities3 activities' }).click();
  await expect(page.getByRole('link', { name: 'Add a whole new meaning to' })).toBeVisible();
  await expect(page.locator('#q-app')).toContainText('Golfing with Midgets');
  await page.reload();
  await page.getByRole('link', { name: 'Add a whole new meaning to' }).click();
  await expect(page.getByRole('strong')).toContainText('Golfing with Midgets');
  await expect(page.getByText('Total time tracked: 0h 0m 0s')).toBeVisible();
  await page.getByText('View Activity').click();
  await expect(page.getByText('warningNo data available')).toBeVisible();
  await page.locator('a').filter({ hasText: 'Activities3 activities' }).click();
  await expect(page.getByRole('link', { name: 'Add a whole new meaning to' })).toBeVisible();
});

test('can track activities (persists after refresh)', async ({ page }) => {
  await page.locator('a').filter({ hasText: 'Activities2 activities' }).click();
  await page.getByRole('link', { name: 'Going for a swim in the' }).click();
  await expect(page.getByRole('main')).toContainText('Total time tracked: 0h 0m 0s');
  await expect(page.getByRole('main')).toContainText('warningNo data available');
  await page.getByText('scheduleTime tracking0 recent').click();
  await page.getByRole('link').click();
  await page.getByRole('button', { name: 'Track' }).first().click();
  await page.locator('a').filter({ hasText: 'Activities2 activities' }).click();
  await page.getByRole('link', { name: 'Going for a swim in the' }).click();
  await expect(page.getByText('Records per page:5arrow_drop_down1-1 of')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('1-1 of 1');
  await page.reload();
  await expect(page.getByText('Records per page:5arrow_drop_down1-1 of')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('1-1 of 1');
});

test('can delete an activity (persists after refresh)', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'A fun run competition against' })).toBeVisible();
  await expect(page.locator('#q-app')).toContainText('Running competition');
  await expect(page.locator('#q-app')).toContainText('A fun run competition against top athletes (Bear, panther, puma)');
  await page.getByRole('link', { name: 'A fun run competition against' }).click();
  await page.locator('button').filter({ hasText: 'edit' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.reload();
  await expect(page.getByRole('link', { name: 'A fun run competition against' })).not.toBeVisible();
  await expect(page.locator('#q-app')).not.toContainText('Running competition');
  await expect(page.locator('#q-app')).not.toContainText('A fun run competition against top athletes (Bear, panther, puma)');
});

test('can undo deleting activity (persists after refresh)', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'A fun run competition against' })).toBeVisible();
  await expect(page.locator('#q-app')).toContainText('Running competition');
  await expect(page.locator('#q-app')).toContainText('A fun run competition against top athletes (Bear, panther, puma)');
  await page.getByRole('link', { name: 'A fun run competition against' }).click();
  await page.locator('button').filter({ hasText: 'edit' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByRole('link', { name: 'A fun run competition against' })).toBeVisible();
  await expect(page.locator('#q-app')).toContainText('Running competition');
  await expect(page.locator('#q-app')).toContainText('A fun run competition against top athletes (Bear, panther, puma)');
  await page.reload();
  await expect(page.getByRole('link', { name: 'A fun run competition against' })).toBeVisible();
  await expect(page.locator('#q-app')).toContainText('Running competition');
  await expect(page.locator('#q-app')).toContainText('A fun run competition against top athletes (Bear, panther, puma)');
});
