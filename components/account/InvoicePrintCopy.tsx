import Image from 'next/image';
import type { Invoice } from '@/lib/account/api';
import { money } from '@/lib/account/state';
import { amountInWords, invoiceTaxes, partyAddress, sumAmounts } from '@/lib/account/invoice-print';
import './invoice-print.css';

function displayRate(rate: string) { const [whole, fraction = ''] = rate.split('.'); return `${whole}.${fraction.padEnd(2, '0')}`; }

function labelled(values: [string, string | null | undefined][]) {
  return values.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`).join(' | ');
}

export function InvoicePrintCopy({ invoice }: { invoice: Invoice }) {
  const lines = [...invoice.lines].sort((a, b) => a.position - b.position);
  const taxable = lines.filter(line => line.taxTreatment === 'TAXABLE');
  const nonTaxable = lines.filter(line => line.taxTreatment !== 'TAXABLE');
  const taxes = invoiceTaxes(lines);
  const company = invoice.company;
  const companyName = company.name || 'Eastern Risen';
  const totalWords = amountInWords(invoice.total);
  const contact = [company.phone, company.mobileNumber, company.email].filter(Boolean).join(', ');
  const registration = labelled([['PAN', company.pan], ['Service Tax No', company.serviceTaxNumber], ['CIN', company.cin], ['GSTIN', company.gstNumber]]);
  const supply = [invoice.placeOfSupplyState, invoice.placeOfSupplyCountry].filter(Boolean).join(', ');
  return (
    <section className="account-print-invoice" aria-label="Printable invoice">
      <header className="invoice-letterhead">
        <Image className="invoice-print-logo" src="/images/eastern-risen-logo-dark.png" alt="Eastern Risen" width={922} height={271} loading="eager" unoptimized />
        <h1>{companyName}</h1>
        {partyAddress(company) && <p>{partyAddress(company)}</p>}
        {contact && <p>{contact}</p>}
        {registration && <p>{registration}</p>}
      </header>
      <h2 className="invoice-print-title">{invoice.status === 'DRAFT' ? 'Draft Tax Invoice' : invoice.status === 'CANCELLED' ? 'Cancelled Tax Invoice' : 'Tax Invoice'}</h2>
      <section className="invoice-print-details">
        {(invoice.serviceCategory?.name || invoice.label) && <strong>{invoice.serviceCategory?.name || invoice.label}{invoice.serviceCategory?.code ? ` (HSN/SAC CODE: ${invoice.serviceCategory.code})` : ''}</strong>}
        <p><b>Invoice No:</b> {invoice.number || 'Unissued draft'}<span className="invoice-print-divider">/</span><b>Date:</b> {invoice.date}</p>
        {invoice.serviceProvidedAt && <p><b>Service provided at:</b> {invoice.serviceProvidedAt}</p>}
        {invoice.guestDisplayText && <p><b>Guest:</b> {invoice.guestDisplayText}{invoice.passengerCount ? ` x ${invoice.passengerCount}` : ''}</p>}
        <p><b>Customer:</b> {invoice.customer.name || 'Customer details unavailable'}{partyAddress(invoice.customer) ? `, ${partyAddress(invoice.customer)}` : ''}{invoice.customer.gstNumber ? `, GSTIN: ${invoice.customer.gstNumber}` : ''}</p>
        {supply && <p><b>Place of supply:</b> {supply}</p>}
        {invoice.status === 'CANCELLED' && <p><b>This invoice is cancelled.</b> Cancellation does not indicate a refund.</p>}
      </section>
      {nonTaxable.length > 0 && <PrintLineGroup title="Non Taxable Item" lines={nonTaxable} totalLabel="Total Non Taxable Amount" />}
      {taxable.length > 0 && <PrintLineGroup title="Taxable Item" lines={taxable} totalLabel="Total Amount Before Tax" />}
      <section className="invoice-print-calculation">
        <p className="invoice-print-tax-heading"><strong>Tax calculation</strong><small>Totals of the item-level tax shown above</small></p>
        {taxes.map(tax => <div key={`${tax.component}:${tax.rate}`}><span>{tax.component} @ {displayRate(tax.rate)}%</span><span>{money(tax.amount)}</span></div>)}
        <div><strong>Total Tax</strong><strong>{money(invoice.taxTotal)}</strong></div>
        <div className="invoice-print-grand-total"><strong>Grand Total</strong><strong>{money(invoice.total)}</strong></div>
      </section>
      {totalWords && <p className="invoice-print-amount-words">{totalWords}</p>}
      <section className="invoice-print-notes">
        {(invoice.paymentInstructions || invoice.bankAccounts.length > 0) && <p>{invoice.paymentInstructions || 'Payment should be made to one of the bank accounts listed below.'}</p>}
        <p><strong>Note:</strong> {invoice.footerNotes || 'This is a computer-generated invoice.'}</p>
      </section>
      {invoice.status !== 'DRAFT' && invoice.status !== 'CANCELLED' && <section className="invoice-print-signature">
        <Image src="/invoice/er-signature.png" alt="Authorised signature" width={51} height={24} loading="eager" unoptimized />
        <strong>{companyName}</strong><span>Authorised Signatory</span>
      </section>}
      {invoice.bankAccounts.length > 0 && <section className="invoice-print-banks"><strong>Bank Details:</strong>{invoice.bankAccounts.map((bank, index) => <p key={index}>{labelled([['Bank', bank.bankName || bank.name], ['Branch', bank.branch], ['Account No', bank.accountNumber], ['IFSC', bank.ifscCode], ['SWIFT', bank.swiftCode]])}</p>)}</section>}
      <footer className="invoice-print-accreditations"><Image src="/invoice/footer-logos.jpg" alt="Eastern Risen accreditations and memberships" width={500} height={48} loading="eager" unoptimized /></footer>
    </section>
  );
}

function PrintLineGroup({ title, lines, totalLabel }: { title: string; lines: Invoice['lines']; totalLabel: string }) {
  const taxable = lines.every(line => line.taxTreatment === 'TAXABLE');
  const total = sumAmounts(lines.map(line => line.amount));
  return <section className="invoice-print-services"><h2>{title}</h2><table>
    <thead><tr><th scope="col">Sl. no.</th><th scope="col">Service details</th><th scope="col">{taxable ? 'Base amount' : 'Amount'}</th></tr></thead>
    <tbody>{lines.map((line, index) => <tr key={line.position}><td>{index + 1}</td><td><span className="invoice-print-description">{line.description}</span>{taxable ? <small className="invoice-print-line-tax"><b>Tax applied:</b> {line.taxes.length ? line.taxes.map(tax => `${tax.component} @ ${tax.rate}% = ${money(tax.amount)}`).join(' | ') : money(line.taxAmount)}</small> : line.taxTreatment !== 'NON_TAXABLE' && <small>{line.taxTreatment.replaceAll('_', ' ')}</small>}</td><td>{money(line.amount)}</td></tr>)}</tbody>
    <tfoot><tr><td colSpan={2}>{totalLabel}</td><td>{total === null ? 'Unavailable' : money(total)}</td></tr></tfoot>
  </table></section>;
}
