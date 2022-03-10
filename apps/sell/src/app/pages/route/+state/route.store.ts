import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { RouteEntity } from '../entities/route.entity';
import { StorageName } from '../../../shared/constaints/storage-name.const';

export interface RouteState extends EntityState<RouteEntity> {
  loading: boolean;
  added: boolean
}

export const createInitialState = () => ({ loading: true, added: false });

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: StorageName.ROUTE })
export class RouteStore extends EntityStore<RouteState> {
  constructor() {
    super(createInitialState());
  }
}
