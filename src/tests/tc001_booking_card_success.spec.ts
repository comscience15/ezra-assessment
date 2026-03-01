import { test } from '@playwright/test';
import { SignInPage } from '../pages/SignInPage';
import { MemberDashboardPage } from '../pages/MemberDashboardPage';
import { SelectPlanPage } from '../pages/SelectPlanPage';
import { ScheduleScanPage } from '../pages/ScheduleScanPage';
import { PaymentPage } from '../pages/PaymentPage';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import { bookingData, member } from '../utils/testData';
import { stripeCards } from '../utils/stripeTestData';
import { MemberJoinPage } from '../pages/MemberJoinPage';

test('TC01: Happy path booking + card payment success @tag: p0_test_cases @tag: happy_path', async ({ page }) => {
    // (globalThis as any) is used to access the process.env object in the global scope
    const baseUrl = (globalThis as any).process.env.MEMBER_BASE_URL!;
    const join = new MemberJoinPage(page);
    const signIn = new SignInPage(page);

    await join.goto(baseUrl);
    await signIn.signIn(member.email, member.password);

    const dash = new MemberDashboardPage(page);
    await dash.expectLoaded();
    await dash.startBooking();

    const step1 = new SelectPlanPage(page);
    await step1.expectLoaded();
    await step1.selectScanByName(bookingData.scanName);
    await step1.confirmScanSelection();

    const step2 = new ScheduleScanPage(page);
    await step2.expectLoaded();
    await step2.selectCenter(bookingData.centerName);

    // Select first available date and 3 time slots
    await step2.selectFirstAvailableDate();
    await step2.selectFirstNTimeSlots(3);

    // Select second available date and 3 time slots (after loading updates)
    await step2.selectSecondAvailableDate();
    await step2.selectSecondNTimeSlots(3);
    await step2.continue(true);

    const pay = new PaymentPage(page);
    await pay.expectLoaded();
    await pay.fillCard(stripeCards.success);
    await pay.continue();

    const conf = new ConfirmationPage(page);
    await conf.expectConfirmed();
});
