import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {StockEntity, StockVisibleEntity} from '../entities';
import {updateStateUiUtil} from '../../../../../../sell/src/app/utils/update-state-ui.util';
import {SupplierEntity} from '../../supplier/entities';

export interface ProductState extends EntityState<StockEntity> {
  loading: boolean;
  added: boolean;
  search: Partial<SupplierEntity>;
  ui: StockVisibleEntity;
}

export function createInitialState(): ProductState {
  return {
    loading: true,
    added: false,
    search: {
      /// FIXME:
      // search: '',
      // inventoryType: -1,
      // warehouseType: -1
    },
    ui: {
      stt: {
        pinned: true,
        visible: true
      },
      code: {
        pinned: false,
        visible: true
      },
      name: {
        pinned: true,
        visible: true
      },
      warehouseType: {
        pinned: true,
        visible: true
      },
      price: {
        pinned: false,
        visible: true
      },
      amount: {
        pinned: false,
        visible: true
      },
      totalCash: {
        pinned: false,
        visible: true
      },
      barcode: {
        pinned: false,
        visible: true
      },
      provider: {
        pinned: false,
        visible: true
      },
      discount: {
        pinned: false,
        visible: true
      },
      exp: {
        pinned: false,
        visible: true
      },
      unit: {
        pinned: false,
        visible: true
      },
      createdAt: {
        pinned: false,
        visible: true
      }
    }
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'product'})
export class StockStore extends EntityStore<ProductState> {
  constructor() {
    super(createInitialState());
  }

  updateUI(newState: Partial<StockVisibleEntity>, type: 'visible' | 'pinned') {
    return this.update(state => {
      return {
        ...state,
        ui: state.ui ? Object.assign(JSON.parse(JSON.stringify(state.ui)), updateStateUiUtil<StockVisibleEntity>(newState, type)) : state.ui
      };
    });
  }
}
