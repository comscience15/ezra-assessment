import { Page, expect } from '@playwright/test';

export class MemberJoinPage {
  constructor(private page: Page) {}

  async goto(baseUrl: string) {
    await this.page.goto(`${baseUrl}/join`, { waitUntil: 'domcontentloaded' });
    await expect(this.page.getByText(/sign up/i)).toBeVisible();
  }
}
