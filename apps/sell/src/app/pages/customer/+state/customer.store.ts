import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {CustomerEntity} from '../entities/customer.entity';
import {StorageName} from '../../../shared/constaints/storage-name.const';

export interface CustomerState extends EntityState<CustomerEntity> {
  loading: boolean;
  added: boolean;
  total: number
  readonly deliveredLoading: boolean;
  readonly deliveringLoading: boolean;
}

const createInitState = () => ({
  loading: true,
  added: false,
  total: 0,
  deliveredLoading: true,
  deliveringLoading: true
});

@Injectable({providedIn: 'root'})
@StoreConfig({name: StorageName.CUSTOMER})
export class CustomerStore extends EntityStore<CustomerState> {
  constructor() {
    super(createInitState);
  }
}
