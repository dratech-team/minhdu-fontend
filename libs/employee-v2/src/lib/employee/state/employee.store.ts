import {EntityState, EntityStore, Store, StoreConfig} from "@datorama/akita";
import {EmployeeEntity} from "../entities";
import {Injectable} from "@angular/core";


export interface EmployeeState extends EntityState<EmployeeEntity>{
  readonly total: number
  readonly loading: boolean,
  readonly added: boolean| null,
}
export function createInitialState():EmployeeState {
  return {
    total: 0,
    loading: true,
    added: null
  }
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'employee'})
export class EmployeeStore extends EntityStore<EmployeeState>{
  constructor() {
    super(createInitialState());
  }
}
