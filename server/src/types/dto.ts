import { z } from "zod";
export const customerSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().min(6),
  address: z.string().min(1),
  billingAddress: z.string().min(1),
});

export type CreateCustomer = z.infer<typeof customerSchema>;

export const STATUSES = ["Pending", "Completed"] as const;
export type Status = (typeof STATUSES)[number];
export const GST_RATE = 0.09;

export const workOrderSchema = z.object({
  customer: z.string(),
  service: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  unitPrice: z.coerce.number().nonnegative(),
  serviceAddress: z.string().min(1),
  billingAddress: z.string().min(1),
  serviceDate: z.coerce.date(),
  status: z.enum(STATUSES).default("Pending"),
});
export type CreateWorkOrder = z.infer<typeof workOrderSchema>;

export const updateWorkOrderSchema = z.object({ status: z.enum(STATUSES) });
export type UpdateWorkOrder = z.infer<typeof updateWorkOrderSchema>;
