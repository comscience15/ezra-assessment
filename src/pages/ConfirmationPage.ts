import { Page, expect } from '@playwright/test';
import { confirmation } from '../utils/selectors';

export class ConfirmationPage {
  constructor(private page: Page) {}

  async expectConfirmed() {
    const title = this.page.locator(confirmation.successTitle);
    await expect(title).toBeVisible();
    await expect(title).toHaveText(confirmation.successMessage);
  }
}
