# Ezra SDET Take-Home — Playwright Automation + Test Design

## Contents
- TESTCASES.md
  - Q1: 15 prioritized booking/payment test cases (risk-based)
  - Q2: privacy integration test + HTTP request templates
  - Q3: approach to securing 100+ sensitive endpoints
- Playwright automation (TypeScript) using Page Object Model
  - TC01 Happy path card payment
  - TC04 Card decline handling
  - TC05 Payment validation

## Why these tests were automated
- TC01: highest revenue-impact path; validates core funnel end-to-end.
- TC04: validates payment failure handling; prevents false confirmation and support incidents.
- TC05: stable UI validation; prevents invalid submit and reduces customer friction.

## Tradeoffs / Assumptions
- Member creation via `/join` is used for deterministic setup (allowed by prompt).
- Locators are primarily text-based from screenshots; if UI text changes, update `src/utils/selectors.ts` only.
- Stripe Elements may render card fields inside iframes. PaymentPage handles iframe-first with a fallback strategy.

## Setup
1. Node.js 18+
2. Install dependencies:
   npm install
3. Configure environment:
   cp .env.example .env
4. Run tests:
   npm test
5. View HTML report:
   npm run report

## Scalability / What I’d add next
- Add network assertions for idempotency (verify only one PaymentIntent/charge request on double submit).
- Add promo code tests and payment method switching tests (Affirm/Bank).
- Add API-based setup/teardown to reduce UI time and flakiness.
- Add CI tags: smoke (P0) on PR, full nightly regression.


## Test results (from local test)
- Can find it at `playwright-report` directory
- See screenshots below

 -- ![Local Test Result](https://github.com/comscience15/ezra-assessment/blob/main/local_test_result.png)
 -- ![Playwright Test Result](https://github.com/comscience15/ezra-assessment/blob/main/playwright_test_result.png)