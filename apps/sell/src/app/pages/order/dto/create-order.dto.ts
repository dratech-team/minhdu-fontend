export interface CreateOrderDto {
  customerId: number;
  provinceId: number;
  wardId: number;
  explain: string;
  createdAt: Date;
  endedAt: Date;
  commodityIds: number[]
}
