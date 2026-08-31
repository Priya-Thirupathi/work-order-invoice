import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
} from "mongoose";
const customerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    billingAddress: { type: String, required: true },
  },
  { timestamps: true },
);
export type Customer = InferSchemaType<typeof customerSchema>;
export type CustomerDoc = HydratedDocument<Customer>;
export const CustomerModel = model("Customer", customerSchema);
