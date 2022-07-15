import { arrayUpdate, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { RouteEntity } from '../entities';
import { BaseSearchRouteDto } from '../dto';
import { getFirstDayInMonth, getLastDayInMonth } from '@minhdu-fontend/utils';
import { StorageName } from '@minhdu-fontend/constants';
import { VisibleEntity } from '@minhdu-fontend/data-models';
import { RouteConstant } from '../constants';

export interface RouteState extends EntityState<RouteEntity> {
  readonly loading?: boolean;
  readonly total: number;
  readonly remain: number;
  readonly expandedAll: boolean;
  readonly search: BaseSearchRouteDto;
  readonly ui: VisibleEntity[];
}

function createInitialState(): RouteState {
  return {
    total: 0,
    remain: 0,
    expandedAll: false,
    search: {
      search: '',
      startedAt_start: getFirstDayInMonth(new Date()),
      startedAt_end: getLastDayInMonth(new Date()),
      status: -1
    },
    ui: RouteConstant.listUI
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.ROUTE })
export class RouteStore extends EntityStore<RouteState> {
  constructor() {
    super(createInitialState());
  }

  updateUI(visible: VisibleEntity) {
    return this.update(({ ui }) => ({
      ui: arrayUpdate(ui, (ui) => ui.key === visible.key, visible)
    }));
  }
}
