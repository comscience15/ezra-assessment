# Ezra SDET Take-Home — Test Cases, Privacy & Security

## Scope and key UI steps observed
Member Portal (MyEzra):
- /sign-in (email/password, Google)
- /join (PII + required consents)
- Member dashboard (Appointments / “Book a scan”)

Booking flow (first 3 steps shown in screenshots):
1) Select your plan / Select your Scan (DOB + Sex at birth + scan selection) `/sign-up/select-plan`
2) Schedule your scan (choose center + 2 appointment times) `/sign-up/schedule-scan`
3) Reserve your appointment + Payment (Stripe) `/sign-up/reserve-appointment`
   - Payment methods: Card, Affirm, Bank
   - Promo code + total + “Continue”

Stripe testing:
- UI interactive tests: use Stripe test card numbers (e.g., 4242… for success, 4000… declines)
- Server-side test code (if applicable): prefer PaymentMethod ids like pm_card_visa

---

## Q1 Part 1 — 15 most important test cases (highest → lowest)

### P0 (Business-critical / revenue / trust)

1) **E2E Happy Path (Card): select scan → schedule (2 appts) → pay by card (success) → confirmation + appointment visible**
   - Use Stripe success card `4242 4242 4242 4242`, exp future, any CVC, ZIP valid
   - Validate: confirmation displayed and appointment appears on dashboard

2) **Payment success but appointment not created (charged-not-booked prevention)**
   - After Stripe success, confirmation/appointment fails to persist
   - Expect: user-visible status + retry/reconcile path + support-safe handling (prevent chargeback)

3) **Idempotency on payment submission (double-click Continue / retry / refresh during submit)**
   - Expect: one charge + one appointment

4) **Stripe decline: actionable error and appointment is NOT created**
   - Use a Stripe decline card number supported by the integration (e.g. `4000 0000 0000 0002` if supported)
   - Expect: error shown, user can retry, no appointment on dashboard

5) **Payment page validation: Card fields block Continue until all required fields valid**
   - Missing/incomplete card number/expiry/CVC/ZIP → Continue blocked or inline errors shown
   - No backend appointment creation attempt is finalized

6) **Price integrity: Total shown = amount charged**
   - Total in UI matches charged amount and receipt confirmation

### P1 (High frequency / high support cost)

7) **Step 1 required fields: DOB and Sex at birth required before continuing**
   - Inline errors and Continue disabled/blocked

8) **Step 1 scan selection required**
   - Cannot proceed without selecting a scan option (e.g., MRI Scan with Spine)

9) **Step 2 requires selecting a center + selecting required number of appointment times (2 appointments)**
   - If only 1 time selected: Continue blocked / error

10) **Location selection affects available times**
    - Switching centers changes available time slots; time zone display is correct

11) **Back navigation preserves or correctly resets state**
    - From Payment back to Schedule and forward again: selections consistent; no ghost times

12) **Promo code behavior**
    - Valid promo reduces total; invalid promo shows error; total never negative; total recalculates correctly

### P2 (Important quality + privacy hygiene)

13) **Session timeout mid-booking**
    - Redirect to sign-in; resume does not leak cross-user state

14) **Payment method switching (Card ↔ Affirm ↔ Bank)**
    - Switching methods updates UI correctly; does not carry invalid state; correct method is used on submit

15) **Sensitive data handling + notifications**
    - No card details in app logs; Stripe Elements used (no PAN/CVC posted to Ezra APIs)
    - Confirmation/receipt sent once; contains no medical data; minimal PII; amount matches UI

---

## Q1 Part 2 — Why top 3 are most important

### #1 Happy path E2E booking + Stripe success (Card Success)
Core revenue flow and highest traffic path. Validates eligibility fields → scheduling → payment → persistence → confirmation. A break here directly impacts revenue and conversion.

### #2 Charged-not-booked prevention
Worst trust failure: money taken but appointment not reserved. Leads to refunds, chargebacks, support load, and reputational damage. Classic failure mode when transaction boundaries and reconciliation are weak.

### #3 Double-submit / idempotency
Payment pages often have issues like users clicking twice, refreshing the page, or slow internet. Without a way to prevent duplicates, you risk charging the customer twice or booking the same appointment more than once. This test makes sure the system handles those real-world situations reliably.

---

## Q2 Part 1 — Privacy integration test (prevent cross-member medical data access)

Goal: prevent IDOR / broken object-level authorization using Medical Questionnaire.
Scenario: Member A must not read/write Member B’s Medical Questionnaire data.

Steps:
1) Create Member A and Member B (member portal join)
2) Login as B and Begin Medical Questionnaire (creates questionnaireIdB)
3) Login as A
4) As A, attempt GET and PATCH/POST B’s questionnaire using questionnaireIdB
5) Expect 403 Forbidden (preferred) or 404 Not Found (acceptable), and no PHI in response

Assertions:
- 403 Forbidden (preferred) or 404 Not Found (acceptable to reduce enumeration)
- Response contains no questionnaire data
- No side effects: B’s questionnaire remains unchanged
- No info leak via error message (avoid enumeration)

---

## Q2 Part 2 — HTTP requests (written templates)

### Auth as Member A
Request Method: POST
Host: https://stage-api.ezra.com
URL: /individuals/member/connect/token
Content-Type: application/json

Payload:
{
  "grant_type": "password",
  "scope": "openid offline_access profile roles",
  "username": "testa1@gmail.com",
  "password": "Testtest1",
  "client_id": "F59A84B4-6E6B-4678-97A0-11C0F6E0719F"
}

### Auth as Member B
Request Method: POST
Host: https://stage-api.ezra.com
URL: /individuals/member/connect/token
Content-Type: application/json

Payload:
{
  "grant_type": "password",
  "scope": "openid offline_access profile roles",
  "username": "testb1@gmail.com",
  "password": "Testtest2",
  "client_id": "F59A84B4-6E6B-4678-97A0-11C0F6E0719F"
}

### Begin questionnaire as Member B (creates questionnaireIdB; example submissionId=2809)
Request Method: POST
Host: https://stage-api.ezra.com
URL: /diagnostics/api/medicaldata/forms/mq/submissions/2809/data
Authorization: Bearer <tokenB>
Content-Type: application/json

{}

### Read B’s questionnaire as A (should fail)
Request Method: GET
Host: https://stage-api.ezra.com
URL: /diagnostics/api/medicaldata/forms/mq/submissions/2809/data
Authorization: Bearer <tokenA>

### Write B’s questionnaire as A (should fail)
Request Method: PATCH
Host: https://stage-api.ezra.com
URL: /diagnostics/api/medicaldata/forms/mq/submissions/2809/data
Authorization: Bearer <tokenA>
Content-Type: application/json

{
  "hasAnswer": true,
  "key": "hasPcp",
  "value": "\"yes\""
}
I
Expected:
- 403/404
- No PHI in response body
- No state change for Member B

---

## Q2 Part 3 — Managing security quality for 100+ sensitive endpoints

Approach:
1) Maintain endpoint inventory (OpenAPI preferred)
2) Classify endpoints by sensitivity/impact (PHI read/write, payment, admin, exports)
3) Apply reusable security contract tests across the inventory:
   - Unauthenticated → 401
   - Wrong role/scope → 403
   - Correct scope → 2xx
   - Object-level authorization prevents IDOR
4) Add privacy checks:
   - Response minimization (only necessary fields)
   - Log redaction (no PHI/tokens/card data)
   - Consistent error messages (avoid user/data enumeration)
5) CI strategy:
   - PR: P0 contract suite + critical auth endpoints
   - Nightly: full contract suite
   - Continuous: dependency scanning, secrets scanning

Tradeoffs & risks:
- Coverage explosion (roles × resources × endpoints) → mitigate with risk tiering + sampling
- Staging/prod mismatch → enforce config parity for auth/gateway policies
