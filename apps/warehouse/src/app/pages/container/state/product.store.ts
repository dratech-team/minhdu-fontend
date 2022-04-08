import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {ContainerEntity, ContainerVisibleEntity} from '../entities';
import {updateStateUiUtil} from '../../../../../../sell/src/app/utils/update-state-ui.util';
import {SupplierEntity} from '../../supplier/entities';
import {BaseSearchContainerDto, SearchContainerDto} from "../dto";

export interface ProductState extends EntityState<ContainerEntity> {
  loading: boolean;
  added: boolean|null;
  search: Partial<BaseSearchContainerDto>;
  ui: ContainerVisibleEntity;
}

export function createInitialState(): ProductState {
  return {
    loading: true,
    added: null,
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
      note:{
        pinned: false,
        visible: true
      },
      supplier:{
        pinned: false,
        visible: true
      },
      category:{
        pinned: false,
        visible: true
      }
    }
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'product'})
export class ProductStore extends EntityStore<ProductState> {
  constructor() {
    super(createInitialState());
  }

  updateUI(newState: Partial<ContainerVisibleEntity>, type: 'visible' | 'pinned') {
    return this.update(state => {
      return {
        ...state,
        ui: state.ui ? Object.assign(JSON.parse(JSON.stringify(state.ui)), updateStateUiUtil<ContainerVisibleEntity>(newState, type)) : state.ui
      };
    });
  }
}
