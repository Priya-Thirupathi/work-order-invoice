import nodemailer, { type Transporter } from "nodemailer";
import type { Invoice } from "../models/invoice.js";

let transporterPromise: Promise<Transporter> | null = null;

async function buildTransporter(): Promise<Transporter> {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }

  const account = await nodemailer.createTestAccount();
  console.log(`[mail] using Ethereal test account ${account.user}`);
  return nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: { user: account.user, pass: account.pass },
  });
}

function getTransporter(): Promise<Transporter> {
  transporterPromise ??= buildTransporter();
  return transporterPromise;
}

export async function sendInvoiceEmail(
  invoice: Invoice,
  pdf: Buffer,
): Promise<string | null> {
  const { billTo } = invoice;
  if (!billTo) throw new Error("Invoice is missing billTo");

  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM ?? "Billing <billing@example.com>",
    to: `${billTo.name} <${billTo.email}>`,
    subject: `Invoice ${invoice.invoiceNumber}`,
    text: [
      `Hi ${billTo.name},`,
      "",
      `Please find invoice ${invoice.invoiceNumber} attached.`,
      `Amount due: $${invoice.grandTotal.toFixed(2)} (incl. GST).`,
      "",
      "Thanks,",
      "Billing",
    ].join("\n"),
    attachments: [
      {
        filename: `${invoice.invoiceNumber}.pdf`,
        content: pdf,
        contentType: "application/pdf",
      },
    ],
  });

  return nodemailer.getTestMessageUrl(info) || null;
}
