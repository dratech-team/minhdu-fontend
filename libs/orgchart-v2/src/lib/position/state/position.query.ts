import {Order, QueryConfig, QueryEntity} from '@datorama/akita';
import {PositionState, PositionStore} from './position.store';
import {Injectable} from '@angular/core';
import {PositionEntity} from "../entities/position.entity";

@Injectable({ providedIn: 'root' })
@QueryConfig({
  sortBy: (a: PositionEntity,b: PositionEntity) =>  a.name.localeCompare(b.name),
  sortByOrder: Order.ASC
})
export class PositionQuery extends QueryEntity<PositionState> {
  constructor(protected store: PositionStore) {
    super(store);
  }
}
