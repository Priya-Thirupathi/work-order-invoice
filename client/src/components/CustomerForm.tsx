import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { createCustomer } from "../api";
import type { CustomerInput } from "../types";

const EMPTY: CustomerInput = {
  name: "",
  email: "",
  phone: "",
  address: "",
  billingAddress: "",
};

type Props = {
  onCreated: () => Promise<void>;
  onError: (message: string) => void;
};

export default function CustomerForm({ onCreated, onError }: Props) {
  const [form, setForm] = useState<CustomerInput>(EMPTY);
  const [saving, setSaving] = useState(false);

  const set =
    (field: keyof CustomerInput) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createCustomer(form);
      setForm(EMPTY);
      await onCreated();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Could not save customer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="card">
      <h2>1. Create Customer</h2>
      <form onSubmit={submit} className="grid">
        <label>
          Name
          <input value={form.name} onChange={set("name")} required />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            required
          />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={set("phone")} required />
        </label>
        <label>
          Customer Address
          <input value={form.address} onChange={set("address")} required />
        </label>
        <label>
          Billing Address
          <input
            value={form.billingAddress}
            onChange={set("billingAddress")}
            required
          />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save Customer"}
        </button>
      </form>
    </section>
  );
}
