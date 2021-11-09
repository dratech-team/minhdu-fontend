
export interface Material {
  id: number,
  code: string,
  name: string,
  provider: string,
  expire: Date,
  price: number,
  discount: number,
  invoice: string,
  unit: any,
  amount: number,
  createdAt: Date,
}
