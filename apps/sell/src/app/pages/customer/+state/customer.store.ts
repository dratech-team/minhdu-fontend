import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {CustomerEntity} from '../entities/customer.entity';
import {StorageName} from '../../../shared/constaints/storage-name.const';
import {SearchCustomerEntity} from "../entities/search-customer.entity";
import {CustomerResource, CustomerType, Gender} from "@minhdu-fontend/enums";
import {CustomerVisibleEntity} from "../entities/customer-visible.entity";

export interface CustomerState extends EntityState<CustomerEntity> {
  loading: boolean;
  added: boolean | null;
  total: number
  deliveredLoading: boolean;
  deliveringLoading: boolean;
  search: SearchCustomerEntity;
  ui: CustomerVisibleEntity
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
  },
  ui: {
    stt: {
      pinned: true,
      visible: true
    },
    name: {
      pinned: true,
      visible: true
    },
    phone: {
      pinned: false,
      visible: true
    },
    birthday: {
      pinned: false,
      visible: true
    },
    gender: {
      pinned: false,
      visible: true
    },
    resource: {
      pinned: false,
      visible: true
    },
    potential: {
      pinned: false,
      visible: true
    },
    customerType: {
      pinned: false,
      visible: true
    },
    email: {
      pinned: false,
      visible: true
    },
    address: {
      pinned: false,
      visible: true
    },
    note: {
      pinned: false,
      visible: true
    },
  }
});

@Injectable({providedIn: 'root'})
@StoreConfig({name: StorageName.CUSTOMER})
export class CustomerStore extends EntityStore<CustomerState> {
  constructor() {
    super(createInitState());
  }

  updateUI(newState: Partial<CustomerVisibleEntity>, type: 'visible' | 'pinned') {
    const newStateClone = JSON.parse(JSON.stringify(newState))
    switch (type) {
      case 'visible':
        newStateClone[Object.keys(newState).toString()].visible = !newStateClone[Object.keys(newState).toString()].visible
        break;
      case "pinned":
        newStateClone[Object.keys(newState).toString()].pinned = !newStateClone[Object.keys(newState).toString()].pinned
        break;
    }
    return this.update(state => {
      return {
        ...state,
        ui: state.ui ? Object.assign(JSON.parse(JSON.stringify(state.ui)), newStateClone) : state.ui
      };
    });
  }
}
