import { Page, expect } from '@playwright/test';
import { scheduleScan } from '../utils/selectors';

export class ScheduleScanPage {
  constructor(private page: Page) {}

  async expectLoaded() {
    await expect(this.page.locator(scheduleScan.title)).toBeVisible();
  }

  async selectCenter(name: string) {
    await this.page.locator(scheduleScan.centerByName(name)).click();
  }

  private async waitForLoadingDone() {
    await this.page.waitForTimeout(1000);
  }

  async selectFirstAvailableDate() {
    const firstAvailableDay = this.page.locator(
      '.vuecal__cell:not(.vuecal__cell--disabled):not(.vuecal__cell--before-min) .vc-day-content'
    ).first();
    await firstAvailableDay.click();
    await this.waitForLoadingDone();
  }

  async selectSecondAvailableDate() {
    await this.waitForLoadingDone();
    // Appointment 2 has its own calendar: use the second calendar on the page (index 1)
    const secondCalendar = this.page.locator('.vuecal__body').nth(1);
    const firstAvailableDay = secondCalendar.locator(
      '.vuecal__cell:not(.vuecal__cell--disabled):not(.vuecal__cell--before-min) .vc-day-content'
    ).first();
    await firstAvailableDay.click();
    await this.waitForLoadingDone();
  }

  async selectFirstNTimeSlots(n: number) {
    // Only visible slots: parent has no display:none (hidden ones are display:none)
    const slotLabels = this.page.locator(
      '.appointments__individual-appointment:not([style*="display: none"]) label'
    );
    await expect(slotLabels.first()).toBeVisible();

    const count = await slotLabels.count();
    const toClick = Math.min(n, count);
    for (let i = 0; i < toClick; i++) {
      await slotLabels.nth(i).click();
      // After first selection a modal may appear: "Please select 3 times..." -> dismiss with "I understand"
      if (i === 0) {
        const understandBtn = this.page.getByRole('button', { name: /i understand/i });
        await understandBtn.click({ timeout: 5000 }).catch(() => {});
      }
    }
  }

  async selectSecondNTimeSlots(n: number) {
    await this.waitForLoadingDone();
    // Use second appointments list if present (Appointment 2), else the only list
    const lists = this.page.locator('.appointments__list');
    const list = (await lists.count()) >= 2 ? lists.nth(1) : lists.first();
    const slotLabels = list.locator(
      '.appointments__individual-appointment:not([style*="display: none"]) label'
    );
    await expect(slotLabels.first()).toBeVisible({ timeout: 15000 });

    const count = await slotLabels.count();
    const toClick = Math.min(n, count);
    for (let i = 0; i < toClick; i++) {
      await slotLabels.nth(i).click();
    }
  }

  async continue(isAppoimentContinue: boolean = false) {
    if (isAppoimentContinue) {
      await this.page.locator(scheduleScan.appointmentContinue).click();
    } else {
      await this.page.locator(scheduleScan.continue).click();
    }
  }
}
