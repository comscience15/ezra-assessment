export const dashboard = {
    bookAScan: 'button:has-text("Book a scan")'
};

export const selectPlan = {
    title: 'text=Review your Scan.',
    dob: 'input[placeholder="Date of birth (MM-DD-YYYY)"]',
    sexAtBirthLabel: 'text=What was your sex at birth?',
    continue: 'button:has-text("Continue")',
  scanCardByName: (name: string) => `p.encounter-title:has-text("${name}")`
};

export const scheduleScan = {
  title: 'text=Schedule your scan',

  centerByName: (name: string) => `p.location-card__name:has-text("${name}")`,
    timeByLabel: (t: string) => `button:has-text("${t}")`,
    continue: 'button:has-text("Continue")',
    appointmentContinue: '[data-test="submit"]'
};

export const payment = {
    title: '.reserve-appointment-layout h4',
    methodCard: 'text=Card',
    promoInput: 'input[placeholder="Promo Code"]',
    applyPromo: 'button:has-text("Apply Code")',
    totalBox: '.pricing-detail .__total p.b1--bold',
    continue: 'button:has-text("Continue")',

    cardNumberInputDirect: '[id="payment-numberInput"], [id="payment-numberinput"]',
    expInputDirect: '[id="payment-expiryInput"], [id="payment-expiryinput"]',
    cvcInputDirect: '[id="payment-cvcInput"], [id="payment-cvcinput"]',
    zipInputDirect: '[id="payment-postalCodeInput"], [id="payment-postalcodeinput"]',
    
    cardNumberIframe: 'iframe[name*="cardNumber"], iframe[title*="card number" i]',
    expIframe: 'iframe[name*="cardExpiry"], iframe[title*="expiration" i]',
    cvcIframe: 'iframe[name*="cardCvc"], iframe[title*="security code" i]',
    cardNumberInput: 'input[name="cardnumber"]',
    expInput: 'input[name="exp-date"]',
    cvcInput: 'input[name="cvc"]',
    zipInput: 'input[name="postal"], input[name="postalCode"], input[placeholder*="ZIP" i], #payment-postalCodeInput',
    anyErrorText: /incomplete|invalid|declined|failed/i,

    cardDeclineError: '#Field-numberError',
    cardDeclineMessage: 'Your card was declined.',
    zipCodeError: '#Field-postalCodeError',
    zipCodeErrorMessage: 'Your ZIP is invalid.',
};

export const confirmation = {
    successTitle: 'h4.confirmation-msg__title',
    successMessage: 'Your requested time slots have been received.'
};
