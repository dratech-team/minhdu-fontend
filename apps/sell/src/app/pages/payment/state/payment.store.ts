import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { StorageName } from '@minhdu-fontend/constants';
import { PaymentEntity } from '../entities';
import { SearchPaymentDto } from '../dto';
import { VisibleEntity } from '@minhdu-fontend/data-models';

export interface PaymentState extends EntityState<PaymentEntity> {
  loading?: boolean;
  total: number;
  search?: Partial<SearchPaymentDto>;
  ui: VisibleEntity;
}

function createInitState(): PaymentState {
  return {
    total: 0,
    ui: { pinned: false, visible: false }
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.PAYMENT })
export class PaymentStore extends EntityStore<PaymentState> {
  constructor() {
    super(createInitState());
  }
}
