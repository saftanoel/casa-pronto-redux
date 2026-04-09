import { test, expect } from '@playwright/test';

const CARD_SELECTOR = 'text="€"';

test.describe('Casa Pronto - Suita Completă de Căutare și Filtrare', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/'); 
  });

  test('Ar trebui să se încarce pagina principală cu titlul corect', async ({ page }) => {
    await expect(page).toHaveTitle(/Casa Pronto/i); 
  });

  // --- 2. HEADER SEARCH ---
  test('Căutarea din Header după "apartament" afișează rezultate', async ({ page, isMobile }) => {
    if (isMobile) {
      await page.getByRole('banner').getByRole('button').click();
      await page.getByRole('textbox', { name: 'Caută proprietăți...' }).click();
      await page.getByRole('textbox', { name: 'Caută proprietăți...' }).fill('apartament');
      await page.getByRole('textbox', { name: 'Caută proprietăți...' }).press('Enter');
    } else {
       const searchButton = page.getByRole('banner').getByRole('button').last();
       await searchButton.click();
       const searchInput = page.getByPlaceholder(/Caută/i).first();
       await searchInput.click(); 
       await searchInput.fill('apartament');
       await searchInput.press('Enter');
    }
    const firstCard = page.locator(CARD_SELECTOR).first();
    await firstCard.waitFor({ state: 'visible', timeout: 45000 });
    expect(await page.locator(CARD_SELECTOR).count()).toBeGreaterThan(0);
  });

  // --- 3. HOMEPAGE DROPDOWN FILTERS ---
  test('Filtrarea de pe Homepage (Dropdown Tip + Buton Căutare)', async ({ page }) => {
    await page.getByRole('combobox').filter({ hasText: 'Toate Tipurile' }).click();
    await page.getByRole('option', { name: 'Apartamente' }).click();
    await page.getByRole('button', { name: 'Caută Anunțuri' }).click();

    const firstCard = page.locator(CARD_SELECTOR).first();
    await firstCard.waitFor({ state: 'visible', timeout: 45000 });
    expect(await page.locator(CARD_SELECTOR).count()).toBeGreaterThan(0);
  });

  // --- 4. NAVIGATION (HAMBURGER) - mobile ---
  test('Pagina Proprietăți: Navigarea din meniul principal', async ({ page, isMobile }) => {
    if (isMobile) {
      await page.getByRole('banner').getByRole('button').click();
      await page.waitForTimeout(500); // lăsăm meniul să gliseze
    }

    // Punem { force: true } ca să fim siguri că dă click, chiar dacă meniul e încă în mișcare
    await page.getByRole('link', { name: 'Proprietăți', exact: true }).first().click({ force: true });
    
    const firstCard = page.locator(CARD_SELECTOR).first();
    await firstCard.waitFor({ state: 'visible', timeout: 45000 });
    expect(await page.locator(CARD_SELECTOR).count()).toBeGreaterThan(0);
  });

  // --- 5. FILTRARE AVANSATĂ MOBIL (playwright record at cursor) ---
  test('Filtrare avansată din modal (Sortare, Tip, Zonă)', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Acest test rulează doar pe formatul de mobil unde există butonul de Filtrează');

    await page.getByRole('combobox').filter({ hasText: 'Toate Tipurile' }).click();
    await page.getByRole('option', { name: 'Apartamente' }).click();
    await page.getByRole('combobox').filter({ hasText: 'Toate Zonele' }).click();
    await page.getByRole('option', { name: 'Alba-Micesti' }).click();
    await page.getByRole('button', { name: 'Caută Anunțuri' }).click();
    
    await page.getByRole('button', { name: 'Filtrează' }).click();
    await page.getByRole('combobox').nth(3).click(); // Sortarea
    await page.getByRole('option', { name: 'Preț (Mare - Mic)' }).click();
    await page.getByRole('button', { name: 'Aplică Filtre' }).click();

    const firstCard = page.locator(CARD_SELECTOR).first();
    await firstCard.waitFor({ state: 'visible', timeout: 45000 });
    expect(await page.locator(CARD_SELECTOR).count()).toBeGreaterThan(0);
  });
});