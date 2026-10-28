export const customerId = '44444444-4444-4444-8444-444444444444';
export const bookingId = '77777777-7777-4777-8777-777777777777';
export const token = 'a'.repeat(43);
export const orderId = `er_${'b'.repeat(32)}`;
export function booking() { return {
  reference: 'ER-TEST', title: 'Customer journey', status: 'QUOTED', serviceStartsOn: '2099-12-01', serviceEndsOn: null,
  paymentReady: false, paymentReviewRequired: false, nextAction: 'REVIEW_AND_ACCEPT', invoice: null, milestones: [], payments: [],
  quote: { id: bookingId, version: 2, legacy: false, description: 'Your complete journey', inclusions: 'Vehicle and driver', exclusions: 'Flights', terms: 'Agreed scope and payment dates', currency: 'INR', total: '2180.00', expiresOn: '2099-12-31', acceptedAt: null,
    pricing: { lines: [
      { position: 2, description: 'Second service', amount: '1000.00', taxTreatment: 'NON_TAXABLE', taxes: [], taxAmount: '0.00', total: '1000.00' },
      { position: 1, description: `First service ${'Long description of journey transport and guide arrangements. '.repeat(12)}`, amount: '1000.00', taxTreatment: 'TAXABLE', taxes: [{ ruleId: 'rule-secret', component: 'CGST', rate: '9.00', amount: '90.00' }, { ruleId: 'rule-secret', component: 'SGST', rate: '9.00', amount: '90.00' }], taxAmount: '180.00', total: '1180.00' }
    ], subtotal: '2000.00', taxTotal: '180.00', grandTotal: '2180.00', taxEffectiveDate: '2000-01-01', currency: 'INR', rounding: 'HALF_UP_PER_LINE_COMPONENT' },
    proposedPlan: { mode: 'CUSTOM', milestones: [{ label: 'Initial payment', amount: '2180.00', dueOn: '2000-01-01' }], resolvedOn: '2000-01-01', policy: null, overdueRule: 'KEEP_ACCEPTED_DATES' }
  }
}; }
export function accepted() { const b = booking(); b.quote.acceptedAt = '2026-10-07T07:00:00Z'; b.quote.expiresOn = '2000-01-01'; b.nextAction = 'AWAIT_ADMIN_PAYMENT_ENABLEMENT'; return b; }
export function milestone() { return { id: '88888888-8888-4888-8888-888888888888', position: 1, label: 'Initial payment', amount: '2180.00', dueOn: '2000-01-01', status: 'PARTIALLY_PAID', paid: false, remaining: '180.00', remainingAmount: '180.00' }; }
export function active() { const b = accepted(); b.status = 'INVOICED'; b.nextAction = 'PAY'; b.paymentReady = true; b.invoice = { number: 'INV-TEST', date: '2026-10-07', total: '2180.00', received: '2000.00', due: '180.00', paymentStatus: 'PARTIALLY_PAID' }; b.milestones = [milestone()]; return b; }
