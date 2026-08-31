import { Router } from "express";
import { validate } from "../middleware/validate.js";
import {
  customerSchema,
  updateWorkOrderSchema,
  workOrderSchema,
} from "../types/dto.js";
import { createCustomer, listCustomers } from "../controllers/customer.js";
import {
  createWorkOrder,
  listWorkOrders,
  updateWorkOrderStatus,
} from "../controllers/workOrder.js";
import { generateInvoice, getInvoice } from "../controllers/invoice.js";

const router = Router();

router.post("/customers", validate(customerSchema), createCustomer);
router.get("/customers", listCustomers);

router.post("/work-orders", validate(workOrderSchema), createWorkOrder);
router.get("/work-orders", listWorkOrders);
router.put(
  "/work-orders/:id",
  validate(updateWorkOrderSchema),
  updateWorkOrderStatus,
);
router.post("/work-orders/:id/invoice", generateInvoice);
router.get("/invoices/:id", getInvoice);

export default router;
