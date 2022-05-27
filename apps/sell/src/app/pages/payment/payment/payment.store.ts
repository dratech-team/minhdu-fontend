import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {StorageName} from '@minhdu-fontend/constants';
import {PaymentEntity} from "../entities/payment.entity";
import {SearchPaymentDto} from "../dto/search-payment.dto";

export interface PaymentState extends EntityState<PaymentEntity> {
  loading: boolean;
  loadMore: boolean;
  added: boolean | null;
  total: number
  search?: Partial<SearchPaymentDto>;
  deleted: boolean | null
}

function createInitState(): PaymentState {
  return {
    loading: true,
    loadMore: false,
    added: null,
    total: 0,
    deleted: null
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: StorageName.PAYMENT})
export class PaymentStore extends EntityStore<PaymentState> {
  constructor() {
    super(createInitState());
  }
}
