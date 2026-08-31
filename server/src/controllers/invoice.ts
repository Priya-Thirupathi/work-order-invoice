import type { RequestHandler } from "express";
import { InvoiceModel } from "../models/invoice.js";
import { createInvoiceForWorkOrder } from "../services/invoice.js";
import { HttpError } from "../middleware/errorHandler.js";
import { renderInvoicePdf } from "../services/pdf.js";
import { sendInvoiceEmail } from "../services/mailer.js";

export const generateInvoice: RequestHandler<{ id: string }> = async (
  req,
  res,
) => {
  const invoice = await createInvoiceForWorkOrder(req.params.id);
  res.status(201).json(invoice);
};

export const getInvoice: RequestHandler<{ id: string }> = async (req, res) => {
  const invoice = await InvoiceModel.findById(req.params.id).lean();
  if (!invoice) throw new HttpError(404, "Invoice not found");
  res.json(invoice);
};

export const getInvoicePdf: RequestHandler<{ id: string }> = async (
  req,
  res,
) => {
  const invoice = await InvoiceModel.findById(req.params.id).lean();
  if (!invoice) throw new HttpError(404, "Invoice not found");

  const pdf = await renderInvoicePdf(invoice);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${invoice.invoiceNumber}.pdf"`,
  );
  res.send(pdf);
};

export const emailInvoice: RequestHandler<{ id: string }> = async (
  req,
  res,
) => {
  const invoice = await InvoiceModel.findById(req.params.id);
  if (!invoice) throw new HttpError(404, "Invoice not found");

  const pdf = await renderInvoicePdf(invoice);
  const previewUrl = await sendInvoiceEmail(invoice, pdf);

  invoice.emailedAt = new Date();
  await invoice.save();

  res.json({
    invoiceNumber: invoice.invoiceNumber,
    sentTo: invoice.billTo?.email,
    emailedAt: invoice.emailedAt,
    previewUrl,
  });
};
