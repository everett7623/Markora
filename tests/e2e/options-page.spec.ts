import { expect, test } from '@playwright/test';

test('renders all foundation navigation routes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Last scanned:/ })).toBeVisible();

  await page.getByRole('link', { name: 'Scanner' }).click();
  await expect(page.getByRole('heading', { name: 'Scanner' })).toBeVisible();

  await page.getByRole('link', { name: 'Markora' }).click();
  await expect(page.getByRole('heading', { name: 'Markora' })).toBeVisible();

  await page.getByRole('link', { name: 'Import / Export' }).click();
  await expect(page.getByRole('heading', { name: 'Import / Export' })).toBeVisible();
  await expect(page.getByText('Choose HTML file')).toBeVisible();

  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: /Automatic daily scan/ })).toBeVisible();
  await expect(page.getByText('Backup management')).toBeVisible();
});

test('renders manager controls for search, tags, move, undo, and delete', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Markora' }).click();

  await expect(page.getByRole('combobox', { name: 'Filter by tag' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Sort bookmarks' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Move target' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Select all visible bookmarks' })).toBeVisible();
  await expect(page.getByLabel('Shortcuts: Delete selected, Escape clear selection, Ctrl+A select visible bookmarks')).toBeVisible();
  await expect(page.getByRole('button', { name: /Move selected/ })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Undo' })).toBeDisabled();
  await expect(page.getByRole('button', { name: /Delete selected/ })).toBeDisabled();
});

test('runs the scanner and renders structural results', async ({ page }) => {
  await page.route(/https:\/\/(github\.com|developer\.mozilla\.org|react\.dev).*/, async (route) => {
    await route.fulfill({ status: 200, body: '' });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Scanner' }).click();
  await page.getByRole('button', { name: 'Run scan' }).click();

  await expect(page.getByText('100%')).toBeVisible();
  await expect(page.getByText('4 / 4 bookmarks processed · 3 unique URLs checked')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Duplicate bookmarks' }).locator('..').getByText('1', { exact: true })).toBeVisible();
  await expect(page.getByText('https://github.com')).toBeVisible();
  await expect(page.getByText('Bookmarks Bar / Empty Folder', { exact: true })).toBeVisible();
});

test('separates broken links from network or proxy failures in the detail workflow', async ({ page }) => {
  await page.route(/https:\/\/github\.com.*/, async (route) => {
    await route.fulfill({ status: 404, body: 'Not found' });
  });
  await page.route(/https:\/\/react\.dev.*/, async (route) => {
    await route.abort('failed');
  });
  await page.route(/https:\/\/developer\.mozilla\.org.*/, async (route) => {
    await route.fulfill({ status: 200, body: '' });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Scanner' }).click();
  await page.getByRole('button', { name: 'Run scan' }).click();

  await expect(page.getByText(/2 confirmed broken, 1 could not be verified/)).toBeVisible();
  await page.getByRole('link', { name: 'Review all 3 link issues' }).click();

  await expect(page.getByRole('heading', { name: 'Link issue review' })).toBeVisible();
  await expect(page.getByText(/browser\/system network and proxy configuration/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirmed broken (2)' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Could not verify (1)' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Select this page' })).toBeVisible();

  await page.getByRole('button', { name: 'Could not verify (1)' }).click();
  await expect(page.getByText('Network, proxy, DNS, TLS, or regional access failure')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Edit URL' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Delete', exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Edit URL' }).click();
  const editUrlDialog = page.getByRole('dialog', { name: 'Edit URL' });
  await expect(editUrlDialog).toBeVisible();
  await editUrlDialog.getByRole('textbox').fill('https://react.dev/learn');
  await editUrlDialog.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByText('No link issues in this category.')).toBeVisible();
});

test('cleans duplicate bookmarks and persists the refreshed scan result', async ({ page }) => {
  await page.route(/https:\/\/(github\.com|developer\.mozilla\.org|react\.dev).*/, async (route) => {
    await route.fulfill({ status: 200, body: '' });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Scanner' }).click();
  await page.getByRole('button', { name: 'Run scan' }).click();
  await page.getByRole('button', { name: 'Keep oldest, remove 1' }).click();

  const duplicatePanel = page.getByRole('heading', { name: 'Duplicate bookmarks' }).locator('../..');
  await expect(duplicatePanel.getByText('0', { exact: true })).toBeVisible();
  await expect(duplicatePanel.getByText('No results')).toBeVisible();

  await page.reload();
  await expect(duplicatePanel.getByText('0', { exact: true })).toBeVisible();
});

test('previews an HTML import, resolves conflicts, and imports new bookmarks', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Import / Export' }).click();

  await page.locator('input[type="file"]').setInputFiles({
    name: 'bookmarks.html',
    mimeType: 'text/html',
    buffer: Buffer.from(`<!DOCTYPE NETSCAPE-Bookmark-file-1>
<DL><p>
  <DT><H3>Imported E2E</H3>
  <DL><p>
    <DT><A HREF="https://github.com">Existing GitHub</A>
    <DT><A HREF="https://e2e-import.test">E2E Imported Bookmark</A>
  </DL><p>
</DL><p>`)
  });

  await expect(page.getByRole('heading', { name: 'Import preview' })).toBeVisible();
  await expect(page.getByText(/2 detected/)).toBeVisible();
  await expect(page.getByText(/1 conflicts/)).toBeVisible();
  await expect(page.getByText('Conflict resolver')).toBeVisible();

  await page.getByRole('button', { name: 'Import new only (1)' }).click();
  await expect(page.getByRole('heading', { name: 'Import preview' })).toBeHidden();

  await page.getByRole('link', { name: 'Markora' }).click();
  await expect(page.getByText('E2E Imported Bookmark')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Imported E2E 1$/ })).toBeVisible();
});

test('renames, tags, moves, deletes, and restores a bookmark', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Markora' }).click();

  await page.getByRole('button', { name: 'Rename GitHub', exact: true }).click();
  const renameDialog = page.getByRole('dialog', { name: 'Rename bookmark' });
  await expect(renameDialog).toBeVisible();
  await renameDialog.getByRole('textbox').fill('GitHub Renamed');
  await renameDialog.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('GitHub Renamed', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Edit tags for GitHub Renamed' }).click();
  const tagDialog = page.getByRole('dialog', { name: 'Comma-separated tags' });
  await expect(tagDialog).toBeVisible();
  await tagDialog.getByRole('textbox').fill('work, code');
  await tagDialog.getByRole('button', { name: 'Save tags' }).click();
  await expect(page.getByText('#work #code')).toBeVisible();

  await page.getByRole('checkbox', { name: 'Select GitHub Renamed' }).check();
  await page.getByRole('combobox', { name: 'Move target' }).selectOption({ label: 'Other Bookmarks' });
  await page.getByRole('button', { name: 'Move selected (1)' }).click();
  await expect(
    page.getByRole('checkbox', { name: 'Select GitHub Renamed' }).locator('..').getByText('Other Bookmarks', { exact: true })
  ).toBeVisible();

  await page.getByRole('checkbox', { name: 'Select GitHub Renamed' }).check();
  await page.getByRole('button', { name: 'Delete selected (1)' }).click();
  await expect(page.getByRole('checkbox', { name: 'Select GitHub Renamed' })).toBeHidden();

  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByRole('checkbox', { name: 'Select GitHub Renamed' })).toBeVisible();
});
