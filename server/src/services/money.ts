import { GST_RATE } from "../types/dto.js";

export const round2 = (n: number): number => Math.round(n * 100) / 100;

export function priceLine(quantity: number, unitPrice: number) {
  const subtotal = round2(quantity * unitPrice);
  const gstAmount = round2(subtotal * GST_RATE);
  return { subtotal, gstAmount, grandTotal: round2(subtotal + gstAmount) };
}
