import { MedicineUnit } from '../../../enums';
export interface Medicine {
  id: number,
  code: String,
  barcode: String,
  name: String,
  provider: String,
  expire: Date,
  price: number,
  discount: number,
  invoice: String,
  unit: MedicineUnit,
  amount: number,
  createdAt: Date,
}
