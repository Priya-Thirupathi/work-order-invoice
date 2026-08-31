import type { WorkOrder } from "../types";

type Props = {
  workOrders: WorkOrder[];
  busyId: string | null;
  onComplete: (id: string) => void;
  onGenerateInvoice: (id: string) => void;
  onViewInvoice: (invoiceId: string) => void;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function WorkOrderList({
  workOrders,
  busyId,
  onComplete,
  onGenerateInvoice,
  onViewInvoice,
}: Props) {
  if (workOrders.length === 0) {
    return (
      <section className="card">
        <h2>3. Work Orders</h2>
        <p className="empty">No work orders yet.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>3. Work Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Work Order ID</th>
            <th>Customer</th>
            <th>Service</th>
            <th>Service Date</th>
            <th className="right">Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {workOrders.map((wo) => {
            const invoiceId = wo.invoice;
            return (
              <tr key={wo._id}>
                <td className="mono">{wo._id}</td>
                <td>{wo.customer.name}</td>
                <td>{wo.service}</td>
                <td>{formatDate(wo.serviceDate)}</td>
                <td className="right">${wo.total.toFixed(2)}</td>
                <td>
                  <span className={`badge ${wo.status.toLowerCase()}`}>
                    {wo.status}
                  </span>
                </td>
                <td>
                  {wo.status === "Pending" && (
                    <button
                      onClick={() => onComplete(wo._id)}
                      disabled={busyId === wo._id}
                    >
                      Mark Completed
                    </button>
                  )}
                  {wo.status === "Completed" && invoiceId === null && (
                    <button
                      onClick={() => onGenerateInvoice(wo._id)}
                      disabled={busyId === wo._id}
                    >
                      Generate Invoice
                    </button>
                  )}
                  {invoiceId !== null && (
                    <button onClick={() => onViewInvoice(invoiceId)}>
                      View Invoice
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
