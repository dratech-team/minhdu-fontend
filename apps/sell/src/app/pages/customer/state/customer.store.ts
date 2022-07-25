import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { BaseSearchCustomerDto, CustomerEntity, CustomerVisibleEntity } from '../entities';
import { CustomerResource, CustomerType, GenderTypeEnum } from '@minhdu-fontend/enums';
import { StorageName } from '@minhdu-fontend/constants';
import { updateStateUiUtil } from '@minhdu-fontend/utils';

export interface CustomerState extends EntityState<CustomerEntity> {
  readonly loading?: boolean;
  readonly total: number;
  readonly remain: number;
  readonly deliveredLoading: boolean;
  readonly deliveredTotal: number;
  readonly deliveredRemain: number;
  readonly deliveringLoading: boolean;
  readonly deliveringTotal: number;
  readonly deliveringRemain: number;
  readonly search: Partial<BaseSearchCustomerDto>;
  readonly ui: CustomerVisibleEntity;
}

function createInitState(): CustomerState {
  return {
    total: 0,
    remain: 0,
    deliveredTotal: 0,
    deliveredRemain: 0,
    deliveringTotal: 0,
    deliveringRemain: 0,
    deliveredLoading: false,
    deliveringLoading: false,
    search: {
      resource: CustomerResource.ALL,
      isPotential: -1,
      type: CustomerType.ALL,
      gender: GenderTypeEnum.ALL,
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
      }
    }
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.CUSTOMER, resettable: true })
export class CustomerStore extends EntityStore<CustomerState> {
  constructor() {
    super(createInitState());
  }

  updateUI(
    newState: Partial<CustomerVisibleEntity>,
    type: 'visible' | 'pinned'
  ) {
    return this.update((state) => {
      return {
        ...state,
        ui: state.ui
          ? Object.assign(
            JSON.parse(JSON.stringify(state.ui)),
            updateStateUiUtil<CustomerVisibleEntity>(newState, type)
          )
          : state.ui
      };
    });
  }
}
