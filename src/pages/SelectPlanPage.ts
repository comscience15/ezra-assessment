import { Page, expect } from '@playwright/test';
import { selectPlan } from '../utils/selectors';

export class SelectPlanPage {
  constructor(private page: Page) {}

  async expectLoaded() {
    await expect(this.page.locator(selectPlan.title)).toBeVisible();
  }

  async confirmScanSelection() {
    await this.page.locator(selectPlan.continue).click();
  }

  async selectScanByName(name: string) {
    await this.page.locator(selectPlan.scanCardByName(name)).first().click();
  }

  async continue() {
    await this.page.locator(selectPlan.continue).click();
  }
}
