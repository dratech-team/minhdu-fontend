import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import {Route} from "../entities/route.entity";

export interface RouteState extends EntityState<Route> {
  readonly loading: boolean;
}

export const createInitialState = () => ({ loading: true });

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'route' })
export class RouteStore extends EntityStore<RouteState> {
  constructor() {
    super(createInitialState());
  }
}
