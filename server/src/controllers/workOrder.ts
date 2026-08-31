import type { RequestHandler } from "express";
import { WorkOrderModel } from "../models/workOrder.js";
import { CustomerModel } from "../models/customer.js";
import { HttpError } from "../middleware/errorHandler.js";
import type { CreateWorkOrder, UpdateWorkOrder } from "../types/dto.js";

export const createWorkOrder: RequestHandler<
  {},
  unknown,
  CreateWorkOrder
> = async (req, res) => {
  const customerExists = await CustomerModel.exists({ _id: req.body.customer });
  if (!customerExists) throw new HttpError(404, "Customer not found");

  const workOrder = await WorkOrderModel.create(req.body);
  res.status(201).json(workOrder);
};

export const listWorkOrders: RequestHandler = async (_req, res) => {
  const workOrders = await WorkOrderModel.find()
    .populate("customer", "name email")
    .sort({ createdAt: -1 })
    .lean();
  res.json(workOrders);
};

export const updateWorkOrderStatus: RequestHandler<
  { id: string },
  unknown,
  UpdateWorkOrder
> = async (req, res) => {
  const workOrder = await WorkOrderModel.findById(req.params.id);
  if (!workOrder) throw new HttpError(404, "Work order not found");

  workOrder.status = req.body.status;
  await workOrder.save();
  res.json(workOrder);
};
