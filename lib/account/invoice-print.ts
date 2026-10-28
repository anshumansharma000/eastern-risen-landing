import type { Invoice, Party } from './api';

// Keep all invoice arithmetic in integer paise, including tax aggregation.
function paise(value: string): bigint | null {
  return /^\d+\.\d{2}$/.test(value) ? BigInt(value.replace('.', '')) : null;
}
function decimal(value: bigint): string {
  return `${value / BigInt(100)}.${(value % BigInt(100)).toString().padStart(2, '0')}`;
}
export function sumAmounts(values: string[]): string | null {
  let sum = BigInt(0);
  for (const value of values) {
    const amount = paise(value);
    if (amount === null) return null;
    sum += amount;
  }
  return decimal(sum);
}
export function invoiceTaxes(lines: Invoice['lines']) {
  const groups = new Map<string, { component: string; rate: string; amount: bigint }>();
  for (const line of lines) {
    for (const tax of line.taxes) {
      const amount = paise(tax.amount);
      if (amount === null || !/^\d+(\.\d+)?$/.test(tax.rate)) return [];
      // Normalize equivalent rates (5, 5.0 and 5.00) without using floats.
      const [whole, fraction = ''] = tax.rate.split('.');
      const rate = `${BigInt(whole)}${fraction.replace(/0+$/, '') ? '.' + fraction.replace(/0+$/, '') : ''}`;
      const key = `${tax.component}:${rate}`;
      const group = groups.get(key) || { component: tax.component, rate, amount: BigInt(0) };
      group.amount += amount;
      groups.set(key, group);
    }
  }
  return [...groups.values()].map(group => ({ ...group, amount: decimal(group.amount) }));
}
export function partyAddress(party: Party): string {
  return [party.address, party.city, party.state, party.postalCode, party.country].filter(Boolean).join(', ');
}
const ones = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
function words(value: bigint): string {
  if (value < BigInt(20)) return ones[Number(value)];
  if (value < BigInt(100)) return `${tens[Number(value / BigInt(10))]}${value % BigInt(10) ? ' ' + words(value % BigInt(10)) : ''}`;
  for (const [unit, label] of [[BigInt(10000000), 'Crore'], [BigInt(100000), 'Lakh'], [BigInt(1000), 'Thousand'], [BigInt(100), 'Hundred']] as const) {
    if (value >= unit) return `${words(value / unit)} ${label}${value % unit ? ' ' + words(value % unit) : ''}`;
  }
  return '';
}
export function amountInWords(value: string): string | null {
  const amount = paise(value);
  if (amount === null) return null;
  return `Rupees ${words(amount / BigInt(100))}${amount % BigInt(100) ? ' and ' + words(amount % BigInt(100)) + ' Paise' : ''} Only.`;
}
