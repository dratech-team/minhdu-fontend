import { MedicineUnit } from "@minhdu-fontend/enums";

export interface Medicine {
  id: number,
  code: string,
  barcode: string,
  name: string,
  provider: string,
  expire: Date,
  price: number,
  discount: number,
  invoice: string,
  unit: MedicineUnit,
  amount: number,
  createdAt: Date,
}
