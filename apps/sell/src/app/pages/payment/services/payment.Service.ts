import {Injectable} from '@angular/core';
import {BaseService} from '@minhdu-fontend/service';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {ResponsePaginate} from '@minhdu-fontend/data-models';
import {PaymentEntity} from "../entities/payment.entity";
import {SearchPaymentDto} from "../dto/search-payment.dto";
import {AddPaymentDto} from "../dto/add-payment.dto";
import {UpdatePaymentDto} from "../dto/update-payment.dto";


@Injectable({ providedIn: 'root' })
export class PaymentService extends BaseService<PaymentEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.SELL.CUSTOMER.PAYMENT, http);
  }

  addOne(props: AddPaymentDto): Observable<PaymentEntity> {
    return super.addOne(props.body);
  }

  pagination(props: SearchPaymentDto): Observable<ResponsePaginate<PaymentEntity>> {
    return super.pagination(props.search);
  }

  update(props: UpdatePaymentDto): Observable<PaymentEntity> {
    return super.update(props.id, props.updates);
  }

  delete(id: number, params?: any): Observable<void> {
    return super.delete(id, params);
  }
}
