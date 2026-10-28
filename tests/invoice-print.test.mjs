import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
const source = await fs.readFile(new URL('../lib/account/invoice-print.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
const { sumAmounts, invoiceTaxes, amountInWords } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);

test('print sums retain exact paise above the safe-number range and reject malformed amounts', () => {
  assert.equal(sumAmounts(['9007199254740993.99', '0.02']), '9007199254740994.01');
  assert.equal(sumAmounts(['0.10', '0.20']), '0.30');
  assert.equal(sumAmounts(['invalid', '50.00']), null);
});
test('print tax rows group equivalent rates but preserve different components and rates', () => {
  const lines = [{ taxes: [{ component: 'IGST', rate: '5.00', amount: '4000.01' }, { component: 'CGST', rate: '2.5', amount: '10.00' }] }, { taxes: [{ component: 'IGST', rate: '5', amount: '0.09' }, { component: 'IGST', rate: '18', amount: '18.00' }] }];
  assert.deepEqual(invoiceTaxes(lines), [{ component: 'IGST', rate: '5', amount: '4000.10' }, { component: 'CGST', rate: '2.5', amount: '10.00' }, { component: 'IGST', rate: '18', amount: '18.00' }]);
  assert.deepEqual(invoiceTaxes([{ taxes: [{ component: 'GST', rate: '5', amount: 'bad' }] }]), []);
});
test('amount words include Indian lakh/crore grouping, zero and fractional paise', () => {
  assert.equal(amountInWords('84000.00'), 'Rupees Eighty Four Thousand Only.');
  assert.equal(amountInWords('12345678.09'), 'Rupees One Crore Twenty Three Lakh Forty Five Thousand Six Hundred Seventy Eight and Nine Paise Only.');
  assert.equal(amountInWords('0.00'), 'Rupees Zero Only.');
  assert.equal(amountInWords('0.50'), 'Rupees Zero and Fifty Paise Only.');
  assert.equal(amountInWords('invalid'), null);
});
