import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {OrderService} from '../service/order.service';
import {OrderActions} from './order.actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConvertBoolean} from '@minhdu-fontend/enums';
import {Router} from '@angular/router';
import {SnackBarComponent} from '../../../../../../../libs/components/src/lib/snackBar/snack-bar.component';
import {OrderEntity} from '../enitities/order.interface';
import {getTotalCommodity} from '../../../../../../../libs/utils/sell.ultil';
import {OrderQuery} from './order.query';
import {OrderStore} from './order.store';
import {RouteAction} from '../../route/+state/route.action';
import {CommodityUniq} from "../../commodity/entities/commodity-uniq.entity";
import {CommodityEntity} from "../../commodity/entities/commodity.entity";
import {arrayUpdate} from "@datorama/akita";
import {updateCommodityDto} from "../../commodity/dto/update-commodity.dto";

@Injectable()
export class OrderEffect {
  convertBoolean = ConvertBoolean;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly actions$: Actions,
    private readonly orderQuery: OrderQuery,
    private readonly orderStore: OrderStore,
    private readonly orderService: OrderService,
    private readonly router: Router
  ) {
  }

  @Effect()
  addOrder$ = this.actions$.pipe(
    ofType(OrderActions.addOne),
    switchMap((props) => {
      this.orderStore.update(state => ({
        ...state, added: false
      }));
      return this.orderService.addOne(props);
    }),
    map((res) => {
      this.orderStore.update(state => ({
        ...state, added: true,
        total: state.total + 1,
        totalCommodity: res.commodities.length > 0 ?
          state.totalCommodity + res.commodities.reduce((a, b) => a + b.amount, 0) : state.commodityUniq,
        commodityUniq: res.commodities?.length > 0 ?
          this.handleCommodityUniq(state.commodityUniq, res.commodities) :
          state.commodityUniq
      }));
      res.expand = this.orderQuery.getValue().expandedAll || false
      this.snackBar.open('Thêm đơn hàng thành công', '', {duration: 1500});
      this.orderStore.add(res);
      this.router.navigate(['don-hang']).then();
    }),
    catchError((err) => {
      return throwError(err);
    })
  );

  @Effect()
  loadAll$ = this.actions$.pipe(
    ofType(OrderActions.loadAll),
    switchMap((props) => {
        this.orderStore.update(state => ({
          ...state, loading: true
        }));
        if (props.param?.orderType) {
          Object.assign(props.param, {orderType: props.param?.orderType === 'ascend' ? 'asc' : 'des'});
        }
        return this.orderService.pagination(Object.assign(
          props.param,
          (props.param?.status === undefined || props.param?.status === null) ? {status: 0} : {})
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
                this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 2500,
                  panelClass: ['background-snackbar'],
                  data: {content: 'Đã lấy hết đơn hàng'}
                });
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
          )
        );
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  loadOne$ = this.actions$.pipe(
    ofType(OrderActions.loadOne),
    switchMap((props) => this.orderService.getOne(props.id)),
    map((order) => {
        return this.orderStore.upsert(order.id, order);
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType(OrderActions.update),
    switchMap((props) => {
        this.orderStore.update(state => ({
          ...state, added: false
        }));
        return this.orderService.update(props.id, props.updates).pipe(
          map((response) => {

            this.orderStore.update(state => ({
              ...state, added: true
            }));
            if (props.inRoute) {
              this.actions$.dispatch(RouteAction.loadOne({id: props.inRoute.routeId}));
            }
            this.snackBar.open('Cập nhật thành công');
            this.orderStore.update(response.id, response);
          })
        );
      }
    ),
    catchError((err) => {
      return throwError(err);
    })
  );

  @Effect()
  updateHide$ = this.actions$.pipe(
    ofType(OrderActions.hide),
    switchMap((props) =>
      this.orderService.updateHide(props.id, props.hide).pipe(
        map((res) => {
          this.orderStore.update(res.id, res);
        }),
        catchError((err) => throwError(err))
      )
    )
  );

  @Effect()
  paymentBill$ = this.actions$.pipe(
    ofType(OrderActions.payment),
    switchMap((props) =>
      this.orderService.payment(props.id, props.order).pipe(
        map((_) => OrderActions.loadOne({id: props.id})),
        catchError((err) => throwError(err))
      )
    )
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType(OrderActions.remove),
    switchMap((props) =>
      this.orderService.delete(props.id).pipe(
        map((_) => {
          this.snackBar.open('Xoá đơn hàng thành công', '', {duration: 1500});
          this.orderStore.update(state => ({
            ...state, total: state.total ? state.total - 1 : state.total
          }));
          this.orderStore.remove(props.id);
        }),
        catchError((err) => throwError(err))
      )
    )
  );

  @Effect()
  cancel$ = this.actions$.pipe(
    ofType(OrderActions.cancelOrder),
    switchMap((prop) => this.orderService.cancelOrder(prop.orderId)),
    map((res) => {
        this.snackBar.open('Huỷ đơn hàng thành công', '', {duration: 1500});
        this.orderStore.remove(res.id);
      }
    ),
    catchError((err) => throwError(err))
  );

  handleCommodityUniq(commoditiesUniq: CommodityUniq[], commodities: CommodityEntity[]) {
    return commodities.map(value => {
      const index = commoditiesUniq.findIndex((commodity: updateCommodityDto) => commodity.code === value.code);
      if (index > -1) {
       Object.assign(commoditiesUniq[index].amount, {amount: commoditiesUniq[index].amount + value.amount})
        return commoditiesUniq
      } else {
        return [...commoditiesUniq].concat([{name: value.name, amount:value.amount, code: value.code}])
      }
    })
  }
}

