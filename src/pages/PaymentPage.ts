import { Page, expect } from '@playwright/test';
import { payment } from '../utils/selectors';

export class PaymentPage {
  constructor(private page: Page) {}

  async expectLoaded() {
    await expect(this.page.locator(payment.title)).toBeVisible();
    try {
      await expect(this.page.locator(payment.totalBox)).toBeVisible();
    } catch (error) {
      console.error('Error checking total box:', error);
      throw error;
    }
  }

  async fillCard(details: { number: string; exp: string; cvc: string; zip: string }, isIncompleteInfo: boolean = false) {
    const frame = this.page.frameLocator('iframe[name*="privateStripeFrame"]').first();

    await frame.getByRole('textbox', { name: 'Card number' }).click();
    await frame.getByRole('textbox', { name: 'Card number' }).fill(details.number);
  
    await frame.getByRole('textbox', { name: 'Expiration date' }).fill(details.exp);
    await frame.getByRole('textbox', { name: 'Security code' }).fill(details.cvc);
    if (isIncompleteInfo) {
      return;
    } else {
      await frame.getByRole('textbox', { name: 'ZIP code' }).fill(details.zip);
    }
  }

  async continue() {
    await this.page.locator(payment.continue).click();
  }

  async expectCardDeclinedError(isEmptyZipCode: boolean = false) {
    const stripeFrame = this.page.frameLocator('iframe[name*="privateStripeFrame"]').first();

    if (isEmptyZipCode) {
      const zipCodeError = stripeFrame.locator(payment.zipCodeError);
      await expect(zipCodeError).toBeVisible({ timeout: 15000 });
      await expect(zipCodeError).toHaveText(payment.zipCodeErrorMessage);
    } else {
      const errorInFrame = stripeFrame.locator(payment.cardDeclineError);
      await expect(errorInFrame).toBeVisible({ timeout: 15000 });
      await expect(errorInFrame).toHaveText(payment.cardDeclineMessage);
    }
  }
}
