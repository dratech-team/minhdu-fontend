import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Order } from './order.interface';
import { createReducer, on } from '@ngrx/store';
import { OrderAction } from './order.action';

export interface OrderState extends EntityState<Order> {
  loaded: boolean,
  selectedOrderId: number,
}
export interface OrderAssignedState extends EntityState<Order> {
  loaded: boolean,
  selectedBillId: number,
}
export const adapter: EntityAdapter<Order> = createEntityAdapter<Order>();

export const initialOrder= adapter.getInitialState({ loaded: false });

export const OrderReducer = createReducer(
  initialOrder,
  on(OrderAction.loadInitSuccess, (state, action) =>
    adapter.setAll(action.orders, { ...state, loaded: true })
  ),
  on(OrderAction.loadMoreOrdersSuccess, (state, action) =>
    adapter.addMany(action.orders, { ...state, loaded: true })
  ),
  on(OrderAction.getOrderSuccess, (state, action) =>
    adapter.upsertOne(action.order, { ...state, loaded: true })
  ),
  on(OrderAction.addOrderSuccess, (state, action) =>
    adapter.addOne(action.order, {...state,loaded: true}),
  )
);

export const initialOrderAssigned= adapter.getInitialState({ loaded: false });

export const OrderAssignedReducer = createReducer(
  initialOrderAssigned,
  on(OrderAction.loadOrdersAssignedSuccess,(state, action)=>
    adapter.setAll(action.orders,{...state,loaded: true})
  ),
  on(OrderAction.loadMoreOrdersAssignedSuccess,(state, action)=>
    adapter.addMany(action.orders,{...state,loaded: true})
  )
)

export const {selectAll,selectEntities,selectTotal} = adapter.getSelectors()
