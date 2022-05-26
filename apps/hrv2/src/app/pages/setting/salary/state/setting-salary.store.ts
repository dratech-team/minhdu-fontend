import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {SalarySettingEntity, SettingSalaryVisibleEntity} from '../entities';
import {BaseSearchSalarySettingDto} from "../dto";
import {updateStateUiUtil} from "@minhdu-fontend/utils";
import {StorageName} from "@minhdu-fontend/constants";
import {BranchEntity, PositionEntity} from "@minhdu-fontend/orgchart-v2";
import {SalaryTypeEnum} from "@minhdu-fontend/enums";

export interface SettingSalaryState extends EntityState<SalarySettingEntity> {
  total: number;
  remain: number,
  loading: boolean;
  loadMore: boolean;
  added: boolean | null;
  search?: {
    search: string,
    branches: BranchEntity[],
    positions: PositionEntity[],
    types: SalaryTypeEnum[]
  };
  ui: SettingSalaryVisibleEntity;
}

export function createInitialState(): SettingSalaryState {
  return {
    total: 0,
    remain: 0,
    loading: true,
    loadMore: false,
    added: null,
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
      note: {
        pinned: false,
        visible: true
      },
      type: {
        pinned: false,
        visible: true
      }
    }
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: StorageName.SETTING_SALARY})
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
