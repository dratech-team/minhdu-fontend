import {Injectable} from '@angular/core';
import {BaseService} from '@minhdu-fontend/service';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable, throwError} from 'rxjs';
import {ResponsePaginate} from '@minhdu-fontend/data-models';
import {CustomerEntity} from '../entities/customer.entity';
import {AddCustomerDto} from '../dto/add-customer.dto';
import {UpdateCustomerDto} from '../dto/update-customer.dto';
import {SearchCustomerDto} from "../dto/search-customer.dto";
import {catchError, map, tap} from "rxjs/operators";
import {CustomerStore} from "../+state";
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable({providedIn: 'root'})
export class CustomerService extends BaseService<CustomerEntity> {
  constructor(
    private readonly customerStore: CustomerStore,
    private readonly message: NzMessageService,
    public readonly http: HttpClient
  ) {
    super(Api.SELL.CUSTOMER.CUSTOMER, http);
  }

  addOne(props: AddCustomerDto): Observable<CustomerEntity> {
    this.customerStore.update(state => ({
      ...state, added: false
    }));
    return super.addOne(props.body).pipe(
      tap((res) => {
          this.customerStore.update(state => ({
            ...state, added: true
          }));
          this.message.success('Thêm khách hàng thành công')
          this.customerStore.add(res);
        }
      ),
      catchError((err) => {
          this.customerStore.update(state => ({
            ...state, added: null
          }))
          return throwError(err)
        }
      )
    );
  }

  pagination(params: SearchCustomerDto): Observable<ResponsePaginate<CustomerEntity>> {
    this.customerStore.update(state => ({
      ...state, loading: true
    }));
    Object.assign(params.search, params.search?.orderType
      ? {orderType: params.search.orderType === 'ascend' ? 'asc' : 'desc'}
      : {});
    return super.pagination(params.search).pipe(
      tap((response) => {
        this.customerStore.update(state => ({...state, loading: false, total: response.total}));
        if (response.data.length === 0) {
          this.message.warning('Đã lấy hết khách hàng');
        } else {
          this.message.success('Tải danh sách khách hàng thành công!!');
        }
        if (params.isPaginate) {
          this.customerStore.add(response.data);
        } else {
          this.customerStore.set(response.data);
        }
      }), catchError(err => {
        this.customerStore.update(state => ({
          ...state, loading: false
        }));
        return throwError(err)
      })
    );
  }

  getOne(id: CustomerEntity['id']): Observable<CustomerEntity> {
    return super.getOne(id).pipe(
      tap(customer => {
        this.message.success('Thành công')
        return this.customerStore.upsert(customer.id, customer)
      }),
      catchError((err) => throwError(err))
    );
  }

  update(update: UpdateCustomerDto): Observable<CustomerEntity> {
    this.customerStore.update(state => ({
      ...state, added: false
    }));
    return super.update(update.id, update.updates).pipe(
      tap((res) => {
        this.customerStore.update(state => ({
          ...state, added: true
        }));
        this.customerStore.update(res.id, res);
      }),
      catchError(err => {
        this.customerStore.update(state => ({
          ...state, added: null
        }))
        return throwError(err)
      })
    );
  }


  delete(id: number): Observable<void> {
    return super.delete(id).pipe(
      tap(() => {
        this.message.success('Xoá khách hàng thành công')
        this.customerStore.remove(id)}),
      catchError((err) => throwError(err))
    );
  }
}
