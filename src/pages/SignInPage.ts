import { Page, expect } from '@playwright/test';

export class SignInPage {
  constructor(private page: Page) {}

  async expectLoaded() {
    await expect(this.page.locator('input#email[name="email"]')).toBeVisible();
    await expect(this.page.locator('input#password[name="password"]')).toBeVisible();
    await this.page.waitForTimeout(1000);
  }

  async goFromJoinIfNeeded() {
    // If still on the join page, click the "Sign In" link to navigate
    const joinSignInLinkByRole = this.page.getByRole('link', { name: /sign ?in/i });
    if (await joinSignInLinkByRole.count()) {
      await joinSignInLinkByRole.first().click();
      return;
    }

    const joinSignInByAria = this.page.locator('a[aria-label="SignIn"]');
    if (await joinSignInByAria.count()) {
      await joinSignInByAria.first().click();
    }
  }

  async signIn(email: string, password: string) {
    await this.goFromJoinIfNeeded();
    await this.expectLoaded();

    await this.page.locator('input#email[name="email"]').fill(email);
    await this.page.locator('input#password[name="password"]').fill(password);

    const submitButton = this.page.getByRole('button', { name: /submit/i });
    if (await submitButton.count()) {
      await submitButton.first().click();
      return;
    }
    await this.page.locator('button.submit-btn').click();
  }
}

