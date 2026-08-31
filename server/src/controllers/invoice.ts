import type { RequestHandler } from "express";
import { InvoiceModel } from "../models/invoice.js";
import { createInvoiceForWorkOrder } from "../services/invoice.js";
import { HttpError } from "../middleware/errorHandler.js";

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
