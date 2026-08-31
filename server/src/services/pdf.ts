import PDFDocument from "pdfkit";
import type { Invoice } from "../models/invoice.js";

const money = (n: number): string => `$${n.toFixed(2)}`;

const date = (d: Date): string =>
  new Date(d).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export function renderInvoicePdf(invoice: Invoice): Promise<Buffer> {
  const { billTo, line } = invoice;
  if (!billTo || !line) {
    return Promise.reject(new Error("Invoice is missing billTo or line"));
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // --- header ---
    doc.fontSize(20).font("Helvetica-Bold").text("INVOICE", { align: "right" });
    doc
      .fontSize(10)
      .font("Helvetica")
      .text(invoice.invoiceNumber, { align: "right" })
      .text(`Work Order: ${String(invoice.workOrder)}`, { align: "right" })
      .text(date(invoice.issuedAt), { align: "right" })
      .moveDown(2);

    // --- bill to ---
    doc.font("Helvetica-Bold").text("Bill To").font("Helvetica");
    doc.text(billTo.name).text(billTo.email).text(billTo.phone).moveDown(0.5);

    doc.font("Helvetica-Bold").text("Customer Address").font("Helvetica");
    doc.text(billTo.customerAddress).moveDown(0.5);

    doc.font("Helvetica-Bold").text("Billing Address").font("Helvetica");
    doc.text(billTo.billingAddress).moveDown(2);

    // --- line item table ---
    const top = doc.y;
    const cols = { service: 50, qty: 300, price: 370, amount: 460 };

    doc.font("Helvetica-Bold");
    doc.text("Service", cols.service, top);
    doc.text("Qty", cols.qty, top, { width: 50, align: "right" });
    doc.text("Unit Price", cols.price, top, { width: 80, align: "right" });
    doc.text("Amount", cols.amount, top, { width: 90, align: "right" });

    doc
      .moveTo(50, top + 15)
      .lineTo(550, top + 15)
      .stroke();

    const row = top + 25;
    doc.font("Helvetica");
    doc.text(line.service, cols.service, row, { width: 240 });
    doc.text(String(line.quantity), cols.qty, row, {
      width: 50,
      align: "right",
    });
    doc.text(money(line.unitPrice), cols.price, row, {
      width: 80,
      align: "right",
    });
    doc.text(money(invoice.subtotal), cols.amount, row, {
      width: 90,
      align: "right",
    });

    // --- totals ---
    doc.y = row + 40;
    const total = (label: string, value: string, bold = false) => {
      doc.font(bold ? "Helvetica-Bold" : "Helvetica");
      const y = doc.y;
      doc.text(label, cols.price, y, { width: 80, align: "right" });
      doc.text(value, cols.amount, y, { width: 90, align: "right" });
      doc.moveDown(0.5);
    };

    total("Subtotal", money(invoice.subtotal));
    total(
      `GST (${(invoice.gstRate * 100).toFixed(0)}%)`,
      money(invoice.gstAmount),
    );
    total("Total", money(invoice.grandTotal), true);

    doc.end();
  });
}
