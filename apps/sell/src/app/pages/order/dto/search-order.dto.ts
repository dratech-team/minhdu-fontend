export interface SearchOrderDto {
  paidType: string;
  customerId: number | string;
  routeId: number;
  customer: string;
  deliveredAt: {
    startedAt: Date,
    endedAt: Date,
  } | Date;
  createdAt: {
    startedAt: Date,
    endedAt: Date,
  } | Date;
  status: 0 | 1;
  explain: string;
  ward: string;
}
