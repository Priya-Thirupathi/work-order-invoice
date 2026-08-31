import { useCallback, useEffect, useState } from "react";
import CustomerForm from "./components/CustomerForm";
import WorkOrderForm from "./components/WorkOrderForm";
import WorkOrderList from "./components/WorkOrderList";
import InvoiceView from "./components/InvoiceView";
import {
  completeWorkOrder,
  generateInvoice,
  getInvoice,
  listCustomers,
  listWorkOrders,
} from "./api";
import type { Customer, Invoice, WorkOrder } from "./types";
import "./App.css";

export default function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refreshCustomers = useCallback(async () => {
    setCustomers(await listCustomers());
  }, []);

  const refreshWorkOrders = useCallback(async () => {
    setWorkOrders(await listWorkOrders());
  }, []);

  useEffect(() => {
    Promise.all([refreshCustomers(), refreshWorkOrders()]).catch(
      (err: unknown) =>
        setError(err instanceof Error ? err.message : "Could not load data"),
    );
  }, [refreshCustomers, refreshWorkOrders]);

  const run = async (id: string, action: () => Promise<void>) => {
    setError(null);
    setBusyId(id);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusyId(null);
    }
  };

  const handleComplete = (id: string) =>
    void run(id, async () => {
      await completeWorkOrder(id);
      await refreshWorkOrders();
    });

  const handleGenerateInvoice = (workOrderId: string) =>
    void run(workOrderId, async () => {
      setInvoice(await generateInvoice(workOrderId));
      await refreshWorkOrders();
    });

  const handleViewInvoice = (invoiceId: string) =>
    void run(invoiceId, async () => {
      setInvoice(await getInvoice(invoiceId));
    });

  return (
    <main>
      <h1>Work Order &amp; Invoice</h1>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <CustomerForm onCreated={refreshCustomers} onError={setError} />

      <WorkOrderForm
        customers={customers}
        onCreated={refreshWorkOrders}
        onError={setError}
      />

      <WorkOrderList
        workOrders={workOrders}
        busyId={busyId}
        onComplete={handleComplete}
        onGenerateInvoice={handleGenerateInvoice}
        onViewInvoice={handleViewInvoice}
      />

      {invoice && <InvoiceView invoice={invoice} onError={setError} />}
    </main>
  );
}
