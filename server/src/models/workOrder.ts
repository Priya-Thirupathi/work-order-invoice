import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
} from "mongoose";
import { STATUSES } from "../types/dto.js";
import { round2 } from "../services/money.js";

const workOrderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    service: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, default: 0 },
    serviceAddress: { type: String, required: true },
    billingAddress: { type: String, required: true },
    serviceDate: { type: Date, required: true },
    status: {
      type: String,
      enum: [...STATUSES],
      default: "Pending",
      required: true,
    },
    invoice: { type: Schema.Types.ObjectId, ref: "Invoice", default: null },
  },
  { timestamps: true },
);

workOrderSchema.pre("save", function (next) {
  this.total = round2(this.quantity * this.unitPrice);
});

export type WorkOrder = InferSchemaType<typeof workOrderSchema>;
export type WorkOrderDoc = HydratedDocument<WorkOrder>;
export const WorkOrderModel = model("WorkOrder", workOrderSchema);
