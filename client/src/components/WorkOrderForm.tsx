import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { createWorkOrder } from "../api";
import type { Customer } from "../types";

type FormState = {
  customer: string;
  service: string;
  quantity: string;
  unitPrice: string;
  serviceAddress: string;
  billingAddress: string;
  serviceDate: string;
};

const EMPTY: FormState = {
  customer: "",
  service: "",
  quantity: "1",
  unitPrice: "",
  serviceAddress: "",
  billingAddress: "",
  serviceDate: "",
};

type Props = {
  customers: Customer[];
  onCreated: () => Promise<void>;
  onError: (message: string) => void;
};

export default function WorkOrderForm({
  customers,
  onCreated,
  onError,
}: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const set =
    (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const total = (Number(form.quantity) || 0) * (Number(form.unitPrice) || 0);

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createWorkOrder({
        ...form,
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
      });
      setForm(EMPTY);
      await onCreated();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Could not save work order");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="card">
      <h2>2. Create Work Order</h2>
      <form onSubmit={submit} className="grid">
        <label>
          Customer
          <select value={form.customer} onChange={set("customer")} required>
            <option value="">Select a customer…</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </label>
        <label>
          Service
          <input value={form.service} onChange={set("service")} required />
        </label>
        <label>
          Quantity
          <input
            type="number"
            min="1"
            step="1"
            value={form.quantity}
            onChange={set("quantity")}
            required
          />
        </label>
        <label>
          Unit Price
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.unitPrice}
            onChange={set("unitPrice")}
            required
          />
        </label>
        <label>
          Service Address
          <input
            value={form.serviceAddress}
            onChange={set("serviceAddress")}
            required
          />
        </label>
        <label>
          Billing Address
          <input
            value={form.billingAddress}
            onChange={set("billingAddress")}
            required
          />
        </label>
        <label>
          Service Date
          <input
            type="date"
            value={form.serviceDate}
            onChange={set("serviceDate")}
            required
          />
        </label>
        <p className="total">Total: ${total.toFixed(2)}</p>
        <button type="submit" disabled={saving || customers.length === 0}>
          {saving ? "Saving…" : "Save Work Order"}
        </button>
      </form>
    </section>
  );
}
