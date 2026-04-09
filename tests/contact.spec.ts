import { test, expect } from '@playwright/test';

test.describe('Pagina de Contact - Hartă și Formular', () => {

  test.beforeEach(async ({ page, isMobile }) => {
    // Navigăm pe homepage
    await page.goto('/');

    if (isMobile) {
      await page.getByRole('banner').getByRole('button').click();
      await page.waitForTimeout(500); // Așteptăm finalizarea animației meniului
    }

    // Navigăm către secțiunea de contact
    await page.getByRole('link', { name: 'Contact' }).first().click();
  });

  // --- 1. VERIFICARE HARTĂ ---
  test('Ar trebui să afișeze harta locației', async ({ page }) => {
    const harta = page.locator('iframe[title="Casa Pronto - Locație pe Google Maps"]');
    await expect(harta).toBeVisible();
  });

  // --- 2. VALIDARE FORMULAR GOL ---
  test('Ar trebui să afișeze erori de validare dacă dăm trimite pe gol', async ({ page }) => {
    // Încercăm trimiterea formularului fără date
    await page.getByRole('button', { name: 'Trimite Mesajul' }).click();

    // Verificăm declanșarea corectă a tuturor mesajelor de eroare
    await expect(page.getByText('Numele este obligatoriu')).toBeVisible();
    await expect(page.getByText('Telefon prea scurt')).toBeVisible();
    await expect(page.getByText('Adresă de email invalidă')).toBeVisible();
    await expect(page.getByText('Subiect obligatoriu')).toBeVisible();
    await expect(page.getByText('Mesaj prea scurt')).toBeVisible();
  });

  // --- 3. COMPLETARE FORMULAR (Happy Path) ---
  test('Ar trebui să permită completarea formularului', async ({ page }) => {
    // Completarea datelor de test
    await page.getByRole('textbox', { name: 'Ion Popescu' }).fill('John Doe');
    await page.getByRole('textbox', { name: '0740 000 000' }).fill('0740123456'); 
    await page.getByRole('textbox', { name: 'email@exemplu.com' }).fill('john.doe@email.com');
    await page.getByRole('textbox', { name: 'Sunt interesat de...' }).fill('Achiziție apartament');
    await page.getByRole('textbox', { name: 'Scrie mesajul tău aici...' }).fill('Test automatizat E2E Playwright. Vă rugăm ignorați acest mesaj.');

    const butonTrimite = page.getByRole('button', { name: 'Trimite Mesajul' });
    
    // Validăm starea butonului înainte de trimitere
    await expect(butonTrimite).toBeEnabled();
    await butonTrimite.click();

  });

});