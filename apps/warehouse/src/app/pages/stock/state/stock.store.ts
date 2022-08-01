import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { StockEntity, StockVisibleEntity } from '../entities';
import { BaseSearchStockDto } from '../dto';
import { updateStateUiUtil } from '@minhdu-fontend/utils';

export interface StockState extends EntityState<StockEntity> {
  loading?: boolean;
  search: Partial<BaseSearchStockDto>;
  ui: StockVisibleEntity;
}

export function createInitialState(): StockState {
  return {
    search: {},
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
      unit: {
        pinned: false,
        visible: true
      },
      note: {
        pinned: false,
        visible: true
      },
      supplier: {
        pinned: false,
        visible: true
      },
      category: {
        pinned: false,
        visible: true
      }
    }
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'stock' })
export class StockStore extends EntityStore<StockState> {
  constructor() {
    super(createInitialState());
  }

  updateUI(newState: Partial<StockVisibleEntity>, type: 'visible' | 'pinned') {
    return this.update((state) => {
      return {
        ...state,
        ui: state.ui
          ? Object.assign(
            JSON.parse(JSON.stringify(state.ui)),
            updateStateUiUtil<StockVisibleEntity>(newState, type)
          )
          : state.ui
      };
    });
  }
}
