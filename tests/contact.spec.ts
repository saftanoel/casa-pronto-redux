import { test, expect } from '@playwright/test';

test.describe('Pagina de Contact - Hartă și Formular', () => {

  test.beforeEach(async ({ page }) => {
    // Navigăm pe homepage și intrăm în Contact (exact cum ai înregistrat tu)
    await page.goto('/');
    await page.getByRole('link', { name: 'Contact' }).click();
  });

  // --- 1. VERIFICARE HARTĂ ---
  test('Ar trebui să afișeze harta locației', async ({ page }) => {
    // Am luat selectorul tău perfect pentru iframe și doar verificăm dacă e vizibil!
    const harta = page.locator('iframe[title="Casa Pronto - Locație pe Google Maps"]');
    await expect(harta).toBeVisible();
  });

  // --- 2. VALIDARE FORMULAR GOL ---
  test('Ar trebui să afișeze erori de validare dacă dăm trimite pe gol', async ({ page }) => {
    // Dăm direct click pe Trimite, fără să completăm nimic
    await page.getByRole('button', { name: 'Trimite Mesajul' }).click();

    // Verificăm TOATE textele roșii de eroare, fix cum apar ele în poză
    await expect(page.getByText('Numele este obligatoriu')).toBeVisible();
    await expect(page.getByText('Telefon prea scurt')).toBeVisible();
    await expect(page.getByText('Adresă de email invalidă')).toBeVisible();
    await expect(page.getByText('Subiect obligatoriu')).toBeVisible();
    await expect(page.getByText('Mesaj prea scurt')).toBeVisible();
  });

  // --- 3. COMPLETARE FORMULAR (Happy Path) ---
  test('Ar trebui să permită completarea formularului', async ({ page }) => {
    // Am transformat click-urile tale în acțiuni de tip .fill() ca să și scrie text!
    await page.getByRole('textbox', { name: 'Ion Popescu' }).fill('John Doe');
    
    await page.getByRole('textbox', { name: '0740 000 000' }).fill('0740123456'); 
    
    // Fill the Email field
    await page.getByRole('textbox', { name: 'email@exemplu.com' }).fill('john.doe@email.com');
    await page.getByRole('textbox', { name: 'Sunt interesat de...' }).fill('Achiziție apartament');
    await page.getByRole('textbox', { name: 'Scrie mesajul tău aici...' }).fill('Bună ziua! Doresc mai multe detalii despre ofertele voastre. Mulțumesc.');

    await page.getByRole('button', { name: 'Trimite Mesajul' }).click();

  });

});