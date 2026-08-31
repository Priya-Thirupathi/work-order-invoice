import { InvoiceModel, type InvoiceDoc } from "../models/invoice.js";
import { WorkOrderModel } from "../models/workOrder.js";
import type { CustomerDoc } from "../models/customer.js";
import { HttpError } from "../middleware/errorHandler.js";
import { priceLine } from "./money.js";
import { GST_RATE } from "../types/dto.js";

export async function createInvoiceForWorkOrder(
  workOrderId: string,
): Promise<InvoiceDoc> {
  const workOrder = await WorkOrderModel.findById(workOrderId).populate<{
    customer: CustomerDoc;
  }>("customer");

  if (!workOrder) throw new HttpError(404, "Work order not found");
  if (workOrder.status !== "Completed") {
    throw new HttpError(
      409,
      "Work order must be Completed before it can be invoiced",
    );
  }

  const existing = await InvoiceModel.findOne({ workOrder: workOrder._id });
  if (existing) return existing;

  const { subtotal, gstAmount, grandTotal } = priceLine(
    workOrder.quantity,
    workOrder.unitPrice,
  );

  const invoice = await InvoiceModel.create({
    invoiceNumber: `INV-${Date.now()}`,
    workOrder: workOrder._id,
    customer: workOrder.customer._id,
    billTo: {
      name: workOrder.customer.name,
      email: workOrder.customer.email,
      phone: workOrder.customer.phone,
      customerAddress: workOrder.customer.address,
      billingAddress: workOrder.billingAddress,
    },
    line: {
      service: workOrder.service,
      quantity: workOrder.quantity,
      unitPrice: workOrder.unitPrice,
    },
    subtotal,
    gstRate: GST_RATE,
    gstAmount,
    grandTotal,
  });

  workOrder.invoice = invoice._id;
  await workOrder.save();

  return invoice;
}
