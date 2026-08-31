import type { RequestHandler } from "express";
import { CustomerModel } from "../models/customer.js";
import type { CreateCustomer } from "../types/dto.js";

export const createCustomer: RequestHandler<
  {},
  unknown,
  CreateCustomer
> = async (req, res) => {
  const customer = await CustomerModel.create(req.body);
  res.status(201).json(customer);
};

export const listCustomers: RequestHandler = async (_req, res) => {
  const customers = await CustomerModel.find().sort({ createdAt: -1 }).lean();
  res.json(customers);
};
