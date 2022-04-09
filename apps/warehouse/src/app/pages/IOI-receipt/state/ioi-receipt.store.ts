import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {IoiReceiptEntity, IoiReceiptVisibleEntity} from '../entities';
import {updateStateUiUtil} from '../../../../../../sell/src/app/utils/update-state-ui.util';
import {SupplierEntity} from '../../supplier/entities';

export interface IoiReceipt extends EntityState<IoiReceiptEntity> {
  loading: boolean;
  added: boolean;
  search: Partial<SupplierEntity>;
  ui: IoiReceiptVisibleEntity;
}

export function createInitialState(): IoiReceipt {
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
      discount: {
        pinned: false,
        visible: true
      },
      createdAt: {
        pinned: false,
        visible: true
      },
      branch: {
        pinned: false,
        visible: true
      },
      type: {
        pinned: false,
        visible: true
      },
      accountedAt: {
        pinned: false,
        visible: true
      },
      approvedAt: {
        pinned: false,
        visible: true
      },
      attachment: {
        pinned: false,
        visible: true
      },
      billCode: {
        pinned: false,
        visible: true
      },
      billedAt: {
        pinned: false,
        visible: true
      },
      completedAt: {
        pinned: false,
        visible: true
      },
      consignment: {
        pinned: false,
        visible: true
      },
      discountType: {
        pinned: false,
        visible: true
      },
      importedAt: {
        pinned: false,
        visible: true
      },
      note: {
        pinned: false,
        visible: true
      },
      orderedAt: {
        pinned: false,
        visible: true
      },
      product: {
        pinned: false,
        visible: true
      },
      tax: {
        pinned: false,
        visible: true
      }
    }
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'stock'})
export class IoiReceiptStore extends EntityStore<IoiReceipt> {
  constructor() {
    super(createInitialState());
  }

  updateUI(newState: Partial<IoiReceiptVisibleEntity>, type: 'visible' | 'pinned') {
    return this.update(state => {
      return {
        ...state,
        ui: state.ui ? Object.assign(JSON.parse(JSON.stringify(state.ui)), updateStateUiUtil<IoiReceiptVisibleEntity>(newState, type)) : state.ui
      };
    });
  }
}
