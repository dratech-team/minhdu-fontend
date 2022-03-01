import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Route } from './route.interface';
import { Injectable } from '@angular/core';

export interface RouteState extends EntityState<Route> {
  readonly loading: boolean;
}

const createInitState = () => ({ loading: true });

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'route' })
export class RouteStore extends EntityStore<RouteState> {
  constructor() {
    super(createInitState);
  }
}
