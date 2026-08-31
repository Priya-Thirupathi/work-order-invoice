import { useState } from "react";
import { invoicePdfUrl, sendInvoice } from "../api";
import type { Invoice } from "../types";

type Props = {
  invoice: Invoice;
  onError: (message: string) => void;
};

const money = (n: number) => `$${n.toFixed(2)}`;

export default function InvoiceView({ invoice, onError }: Props) {
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const send = async () => {
    setSending(true);
    try {
      const result = await sendInvoice(invoice._id);
      setSentTo(result.sentTo);
      setPreviewUrl(result.previewUrl);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Could not send invoice");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="card">
      <h2>4. Invoice {invoice.invoiceNumber}</h2>

      <dl className="details">
        <dt>Work Order ID</dt>
        <dd className="mono">{invoice.workOrder}</dd>
        <dt>Customer Name</dt>
        <dd>{invoice.billTo.name}</dd>
        <dt>Customer Address</dt>
        <dd>{invoice.billTo.customerAddress}</dd>
        <dt>Billing Address</dt>
        <dd>{invoice.billTo.billingAddress}</dd>
        <dt>Service</dt>
        <dd>{invoice.line.service}</dd>
        <dt>Quantity</dt>
        <dd>{invoice.line.quantity}</dd>
        <dt>Unit Price</dt>
        <dd>{money(invoice.line.unitPrice)}</dd>
      </dl>

      <table className="totals">
        <tbody>
          <tr>
            <td>Subtotal</td>
            <td className="right">{money(invoice.subtotal)}</td>
          </tr>
          <tr>
            <td>GST ({(invoice.gstRate * 100).toFixed(0)}%)</td>
            <td className="right">{money(invoice.gstAmount)}</td>
          </tr>
          <tr className="grand">
            <td>Grand Total</td>
            <td className="right">{money(invoice.grandTotal)}</td>
          </tr>
        </tbody>
      </table>

      <div className="actions">
        <a className="button" href={invoicePdfUrl(invoice._id)}>
          Download Invoice
        </a>
        <button onClick={send} disabled={sending}>
          {sending ? "Sending…" : "Send Invoice"}
        </button>
      </div>

      {sentTo && <p className="ok">Invoice emailed to {sentTo}.</p>}
      {previewUrl && (
        <p className="ok">
          <a href={previewUrl} target="_blank" rel="noreferrer">
            View the sent email
          </a>
        </p>
      )}
    </section>
  );
}
