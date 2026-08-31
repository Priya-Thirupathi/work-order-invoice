import type {
  Customer,
  CustomerInput,
  EmailResult,
  Invoice,
  WorkOrder,
  WorkOrderInput,
} from "./types";

type Options = { method?: string; body?: unknown };

async function request<T>(path: string, opts: Options = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: opts.method ?? "GET",
    headers: opts.body ? { "Content-Type": "application/json" } : undefined,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  if (!res.ok) {
    const problem = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(problem?.error ?? `Request failed (${res.status})`);
  }

  return (await res.json()) as T;
}

export const listCustomers = () => request<Customer[]>("/customers");

export const createCustomer = (input: CustomerInput) =>
  request<Customer>("/customers", { method: "POST", body: input });

export const listWorkOrders = () => request<WorkOrder[]>("/work-orders");

export const createWorkOrder = (input: WorkOrderInput) =>
  request<unknown>("/work-orders", { method: "POST", body: input });

export const completeWorkOrder = (id: string) =>
  request<unknown>(`/work-orders/${id}`, {
    method: "PUT",
    body: { status: "Completed" },
  });

export const generateInvoice = (workOrderId: string) =>
  request<Invoice>(`/work-orders/${workOrderId}/invoice`, { method: "POST" });

export const getInvoice = (id: string) => request<Invoice>(`/invoices/${id}`);

export const sendInvoice = (id: string) =>
  request<EmailResult>(`/invoices/${id}/send-email`, { method: "POST" });

export const invoicePdfUrl = (id: string) => `/api/invoices/${id}/pdf`;
