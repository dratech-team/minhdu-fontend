import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { OrderService } from '../service';
import { OrderActions } from './order.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConvertBoolean } from '@minhdu-fontend/enums';
import { Router } from '@angular/router';
import { getTotalCommodity } from '../../../../../../../libs/utils/sell.ultil';
import { OrderQuery } from './order.query';
import { OrderStore } from './order.store';
import { RouteActions } from '../../route/+state';
import { CommodityEntity, CommodityUniq } from '../../commodity/entities';
import { CustomerStore } from '../../customer/+state';
import { OrderEntity } from '../enitities/order.entity';
import { AddOrderDto, UpdateOrderDto } from '../dto';
import { arrayAdd, arrayRemove, arrayUpdate } from '@datorama/akita';
import { CommodityStore } from '../../commodity/+state';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class OrderEffect {
  convertBoolean = ConvertBoolean;

  constructor(
    private readonly message: NzMessageService,
    private readonly actions$: Actions,
    private readonly orderQuery: OrderQuery,
    private readonly orderStore: OrderStore,
    private readonly orderService: OrderService,
    private readonly router: Router,
    private readonly customerStore: CustomerStore,
    private readonly commodityStore: CommodityStore
  ) {
  }

  @Effect()
  addOrder$ = this.actions$.pipe(
    ofType(OrderActions.addOne),
    switchMap((props: AddOrderDto) => {
      this.orderStore.update(state => ({
        ...state,
        loading: true
      }));
      return this.orderService.addOne(props).pipe(
        map((res) => {
          this.commodityStore.remove(props.body.commodityIds);
          this.orderStore.update(state => ({
            ...state,
            loading: false,
            total: state.total + 1,
            totalCommodity: res.commodities.length > 0 ?
              state.totalCommodity + res.commodities.reduce((a, b) => a + b.amount, 0) : state.totalCommodity,
            commodityUniq: res.commodities?.length > 0 ?
              this.handleCommodityUniq(state.commodityUniq, res.commodities, 'add') :
              state.commodityUniq
          }));
          res.expand = this.orderQuery.getValue().expandedAll || false;
          this.message.success('Thêm đơn hàng thành công');
          this.orderStore.add(res);
          this.router.navigate(['don-hang']).then();
        }),
        catchError((err) => {
          this.orderStore.update(state => ({
            ...state,
            loading: undefined
          }));
          return of(OrderActions.error(err));
        })
      );
    })
  );

  @Effect()
  loadAll$ = this.actions$.pipe(
    ofType(OrderActions.loadAll),
    switchMap((props) => {
        this.orderStore.update(state => ({
          ...state,
          loading: true
        }));
        if (props.param?.orderType) {
          Object.assign(props.param, { orderType: props.param?.orderType === 'ascend' ? 'asc' : 'des' });
        }
        return this.orderService.pagination(Object.assign(
          props.param,
          (props.param?.status === undefined || props.param?.status === null) ? { status: 0 } : {})
        ).pipe(
          map((response) => {
              const expanedAll = this.orderQuery.getValue().expandedAll;
              this.orderStore.update(state => ({
                ...state,
                loading: false,
                total: response.total,
                totalCommodity: response.commodityUniq.reduce((x, y) => x + y.amount, 0),
                commodityUniq: response.commodityUniq
              }));
              if (!response.data.length) {
                if (!props.isPagination) {
                  this.orderStore.set(response.data);
                }
              } else {
                const data = response.data.map((order: OrderEntity) => Object.assign(order, {
                  expand: expanedAll,
                  totalcommodity: order.totalCommodity = getTotalCommodity(order.commodities)
                }));
                if (props.isPagination) {
                  this.orderStore.add(data);
                } else {
                  this.orderStore.set(data);
                }
              }
            }
          ),
          catchError((err) => {
            this.orderStore.update(state => ({
              ...state,
              loading: undefined
            }));
            return of(OrderActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  loadOne$ = this.actions$.pipe(
    ofType(OrderActions.loadOne),
    switchMap((props) => this.orderService.getOne(props.id).pipe(
      map((order) => {
          return this.orderStore.upsert(order.id, order);
        }
      ),
      catchError((err) => of(OrderActions.error(err)))
    ))
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType(OrderActions.update),
    switchMap((props: UpdateOrderDto) => {
        this.orderStore.update(state => ({
          ...state,
          loading: true
        }));
        return this.orderService.update(props).pipe(
          map((response) => {
            const orderBefore = this.orderQuery.getEntity(response.id);
            if (orderBefore)
              this.orderStore.update(state => ({
                ...state,
                loading: false
              }));
            if (response.deliveredAt) {
              console.log(response);
              this.customerStore.update(response.customerId, entity => {
                return {
                  debt: entity.debt ? entity.debt + response.paymentTotal - response.commodityTotal : entity.debt,
                  delivering: arrayRemove(entity.delivering, response.id),
                  delivered: arrayAdd(entity.delivered, response)
                };
              });
            }
            if (props.inRoute) {
              this.actions$.dispatch(RouteActions.loadOne({ id: props.inRoute.routeId }));
            }
            this.message.success('Cập nhật thành công');
            this.orderStore.update(response.id, response);
          }),
          catchError((err) => {
            this.orderStore.update(state => ({
              ...state,
              loading: undefined
            }));
            return of(OrderActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  updateHide$ = this.actions$.pipe(
    ofType(OrderActions.hide),
    switchMap((props) =>
      this.orderService.updateHide(props.id, props.hide).pipe(
        map((res) => {
          this.message.success('Cập nhật thành công');
          this.orderStore.update(res.id, res);
          this.customerStore.update(res.customerId, entity => {
            return {
              debt: entity.debt ? entity.debt + (res.paymentTotal - res.commodityTotal) : entity.debt,
              delivered: arrayUpdate(entity.delivered, res.id, res)
            };
          });
        }),
        catchError((err) => of(OrderActions.error(err)))
      )
    )
  );

  @Effect()
  paymentBill$ = this.actions$.pipe(
    ofType(OrderActions.payment),
    switchMap((props) =>
      this.orderService.payment(props.id, props.order).pipe(
        map((_) => OrderActions.loadOne({ id: props.id })),
        catchError((err) => of(OrderActions.error(err)))
      )
    )
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType(OrderActions.remove),
    switchMap((props) => {
        this.orderStore.update(state => ({
          ...state, loading: true
        }));
        return this.orderService.delete(props.id).pipe(
          map((_) => {
            this.message.success('Xoá đơn hàng thành công');
            const orderDelete = this.orderQuery.getEntity(props.id);
            if (orderDelete)
              this.orderStore.update(state => ({
                ...state,
                loading: false,
                total: state.total - 1,
                totalCommodity: orderDelete.commodities?.length > 0 ?
                  state.totalCommodity - orderDelete.commodities.reduce((a, b) => a + b.amount, 0) : state.commodityUniq,
                commodityUniq: orderDelete.commodities?.length > 0 ?
                  this.handleCommodityUniq(state.commodityUniq, orderDelete.commodities, 'delete') :
                  state.commodityUniq
              }));
            this.orderStore.remove(props.id);
          }),
          catchError((err) => {
            this.orderStore.update(state => ({
              ...state,
              loading: undefined
            }));
            return of(OrderActions.error(err));
          })
        );
      }
    )
  );

  @Effect()
  cancel$ = this.actions$.pipe(
    ofType(OrderActions.cancelOrder),
    switchMap((prop) => this.orderService.cancelOrder(prop.orderId).pipe(
      map(res => {
          this.customerStore.update(res.customerId, ({ delivering }) => ({
            delivering: arrayRemove(delivering, res.id)
          }));
          this.message.success('Huỷ đơn hàng thành công');
          this.orderStore.remove(res.id);
        }
      ),
      catchError((err) => of(OrderActions.error(err)))
    ))
  );

  handleCommodityUniq(
    commoditiesUniq: CommodityUniq[],
    commodities: CommodityEntity[],
    action: 'delete' | 'add'
  ) {
    const result = JSON.parse(JSON.stringify(commoditiesUniq));
    commodities.forEach(value => {
      const index = result.findIndex((commodity: CommodityEntity) => commodity.code === value.code);
      switch (action) {
        case 'add':
          if (index > -1) {
            result[index].amount = result[index].amount + value.amount;
          } else {
            result.push({ name: value.name, code: value.code, amount: value.amount });
          }
          break;
        case 'delete':
          if (result[index].amount - value.amount === 0) {
            result.splice(index, 1);
          } else {
            result[index].amount = result[index].amount - value.amount;
          }
          break;
      }
    });
    return result;
  }
}

