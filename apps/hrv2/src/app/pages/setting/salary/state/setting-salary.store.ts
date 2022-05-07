import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {SalarySettingEntity, SettingSalaryVisibleEntity} from '../entities';
import {BaseSearchSalarySettingDto} from "../dto";
import {updateStateUiUtil} from "@minhdu-fontend/utils";

export interface SettingSalaryState extends EntityState<SalarySettingEntity> {
  loading: boolean;
  added: boolean|null;
  search: Partial<BaseSearchSalarySettingDto>;
  ui: SettingSalaryVisibleEntity;
}

export function createInitialState(): SettingSalaryState {
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
      title: {
        pinned: true,
        visible: false
      },
      rate: {
        pinned: false,
        visible: true
      },
      price: {
        pinned: false,
        visible: true
      },
      note:{
        pinned: false,
        visible: true
      },
      type:{
        pinned: false,
        visible: true
      }
    }
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'salary-setting'})
export class SettingSalaryStore extends EntityStore<SettingSalaryState> {
  constructor() {
    super(createInitialState());
  }

  updateUI(newState: Partial<SettingSalaryVisibleEntity>, type: 'visible' | 'pinned') {
    return this.update(state => {
      return {
        ...state,
        ui: state.ui ? Object.assign(JSON.parse(JSON.stringify(state.ui)), updateStateUiUtil<SettingSalaryVisibleEntity>(newState, type)) : state.ui
      };
    });
  }
}
