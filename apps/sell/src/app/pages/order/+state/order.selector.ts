import { OrderAssignedState, OrderState } from './order.reducer';
import { Order } from './order.interface';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as fromOrder from './order.reducer';


export interface state {
  order: OrderState,
}
export interface OrdersAssignedState {
  order: OrderAssignedState,
}

export const getSelectedOrderId = (state: Order) => state.id;
export const selectorOrderAssignedState = createFeatureSelector<OrderAssignedState>(
  FeatureName.ORDER_ASSIGNED
)

export const selectorOrderState = createFeatureSelector<OrderState>(
  FeatureName.ORDER
)
export const selectorOrderEntities = createSelector(
  selectorOrderState,
  fromOrder.selectEntities,
);

export const selectorAllOrdersAssigned = createSelector(
  selectorOrderAssignedState,
  fromOrder.selectAll,
);
export const selectorOrdersAssignedById = (id: number) => createSelector(
  selectorAllOrdersAssigned,
  (OrdersAssigned) =>{
    const result:Order[] = []
    OrdersAssigned.forEach(item => {
      if(item.customerId == id){
        result.push(item)
      }
    })
    return result
  }
);
export const selectorOrdersNotAssignedById = (id: number) => createSelector(
  selectorAllOrders,
  (OrdersNotAssigned) =>{
    const result:Order[] = []
    OrdersNotAssigned.forEach(item => {
      if(item.customerId == id && !item.deliveredAt){
        result.push(item)
      }
    })
    return result
  }
);


export const selectorAllOrders = createSelector(
  selectorOrderState,
  fromOrder.selectAll,
);

export const selectorOrdersByCustomerId = (customerId: number) => createSelector(
  selectorAllOrders,
  (orderEntities) => {
    const result: Order[] = []
    orderEntities.forEach(val =>{
       if(val.customerId == customerId){
         result.push(val)
       }
    })
    return result
  }
);

export const selectorCurrentOrder = (id: number)  =>createSelector(
  selectorOrderEntities,
  (orderEntities) =>{
    return  orderEntities[id]
  }
)
export const selectOrdersByIds = (ids: number[]) => createSelector(
  selectorAllOrders,
  (orders ) => {
    const result: Order[] = []
    orders.forEach(val =>{
        if(ids.includes(val.id)){
          result.push(val)
        }
    })
    return result;
  }
)


export const selectedOrderLoaded = createSelector(
  selectorOrderState,
  (state) => state.loaded
)

export const selectedOrderAdded = createSelector(
  selectorOrderState,
  (state) => state.added
)

export const selectedNotOrderLoaded = createSelector(
  selectorOrderAssignedState,
  (state) => state.loaded
)

export const selectedTotalOrder = createSelector(
  selectorOrderState,
  (state) => state.total
)

export const selectorOrderTotal = createSelector(
  selectorOrderState,
  fromOrder.selectTotal
);
export const selectorOrderAssignedTotal = createSelector(
  selectorOrderAssignedState,
  fromOrder.selectTotal
);
