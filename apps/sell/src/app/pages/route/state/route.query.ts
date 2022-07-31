import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { RouteState, RouteStore } from './route.store';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RouteQuery extends QueryEntity<RouteState> {
  constructor(protected store: RouteStore) {
    super(store);
  }

  selectUI() {
    return this.select((state) => state.ui).pipe(
      map((ui) => {
        return ui.filter((item) => item.visible);
      })
    );
  }
}
