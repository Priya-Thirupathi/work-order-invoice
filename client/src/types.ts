export const STATUSES = ["Pending", "Completed"] as const;
export type Status = (typeof STATUSES)[number];

export type Customer = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  billingAddress: string;
};

export type CustomerInput = Omit<Customer, "_id">;

export type WorkOrder = {
  _id: string;
  customer: Pick<Customer, "_id" | "name" | "email">;
  service: string;
  quantity: number;
  unitPrice: number;
  total: number;
  serviceAddress: string;
  billingAddress: string;
  serviceDate: string;
  status: Status;
  invoice: string | null;
};

export type WorkOrderInput = {
  customer: string;
  service: string;
  quantity: number;
  unitPrice: number;
  serviceAddress: string;
  billingAddress: string;
  serviceDate: string;
};

export type Invoice = {
  _id: string;
  invoiceNumber: string;
  workOrder: string;
  customer: string;
  billTo: {
    name: string;
    email: string;
    phone: string;
    customerAddress: string;
    billingAddress: string;
  };
  line: { service: string; quantity: number; unitPrice: number };
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  grandTotal: number;
  issuedAt: string;
  emailedAt: string | null;
};

export type EmailResult = {
  invoiceNumber: string;
  sentTo: string;
  emailedAt: string;
  previewUrl: string | null;
};
