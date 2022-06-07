import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {StorageName} from '@minhdu-fontend/constants';
import {PaymentEntity} from "../entities/payment.entity";
import {SearchPaymentDto} from "../dto/search-payment.dto";

export interface PaymentState extends EntityState<PaymentEntity> {
  loading?: boolean;
  total: number
  search?: Partial<SearchPaymentDto>;
}

function createInitState(): PaymentState {
  return {
    total: 0,
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: StorageName.PAYMENT})
export class PaymentStore extends EntityStore<PaymentState> {
  constructor() {
    super(createInitState());
  }
}
