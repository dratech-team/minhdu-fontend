import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {CustomerEntity} from '../entities/customer.entity';
import {StorageName} from '../../../shared/constaints/storage-name.const';
import {SearchCustomerEntity} from "../entities/search-customer.entity";
import {CustomerResource, CustomerType, Gender} from "@minhdu-fontend/enums";

export interface CustomerState extends EntityState<CustomerEntity> {
  loading: boolean;
  added: boolean | null;
  total: number
  deliveredLoading: boolean;
  deliveringLoading: boolean;
  search: SearchCustomerEntity
}

const createInitState = () => ({
  loading: true,
  added: null,
  total: 0,
  deliveredLoading: true,
  deliveringLoading: true,
  search: {
    resource: CustomerResource.ALL,
    isPotential: -1,
    customerType: CustomerType.ALL,
    gender: Gender.ALL,
    search: ''
  }
});

@Injectable({providedIn: 'root'})
@StoreConfig({name: StorageName.CUSTOMER})
export class CustomerStore extends EntityStore<CustomerState> {
  constructor() {
    super(createInitState());
  }
}
