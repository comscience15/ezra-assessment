import { Page, expect } from '@playwright/test';

export class MemberDashboardPage {
  constructor(private page: Page) {}

  async expectLoaded() {
    await expect(
      this.page.locator('div.section-header', { hasText: /Appointments/i })
    ).toBeVisible();
    await expect(
      this.page.locator('div.section-header >> button', { hasText: /Book a scan/i })
    ).toBeVisible();
  }

  async startBooking() {
    await this.page
      .locator('div.section-header >> button', { hasText: /Book a scan/i })
      .click();
  }
}
