import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
} from "mongoose";
import { GST_RATE } from "../types/dto.js";
const invoiceSchema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    workOrder: {
      type: Schema.Types.ObjectId,
      ref: "WorkOrder",
      required: true,
      unique: true,
    },
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    billTo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      customerAddress: { type: String, required: true },
      billingAddress: { type: String, required: true },
    },
    line: {
      service: { type: String, required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
    },
    subtotal: { type: Number, required: true },
    gstRate: { type: Number, required: true, default: GST_RATE },
    gstAmount: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    issuedAt: { type: Date, default: Date.now },
    emailedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export type Invoice = InferSchemaType<typeof invoiceSchema>;
export type InvoiceDoc = HydratedDocument<Invoice>;
export const InvoiceModel = model("Invoice", invoiceSchema);
