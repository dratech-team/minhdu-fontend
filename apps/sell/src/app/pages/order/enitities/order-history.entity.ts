export interface OrderHistoryEntity {
  id: number;
  orderId: number;
  type: string;
  note: string;
  timestamp: Date;
}
