import {Injectable} from '@angular/core';
import {BaseService} from '@minhdu-fontend/service';
import {Commodity} from '../+state/commodity.interface';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {ResponsePaginate} from '@minhdu-fontend/data-models';
import {UpdateNum} from '@ngrx/entity/src/models';

@Injectable({
  providedIn: 'root'
})
export class CommodityService extends BaseService<Commodity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.SELL.COMMODITY, http);
  }

  addOne(props: Commodity): Observable<Commodity> {
    return super.addOne(props);
  }

  getAll(params?: any): Observable<Commodity[]> {
    return super.getAll(params);
  }

  getTemplate(): Observable<any> {
    return this.http.get(Api.SELL.COMMODITY_TEMPLATE);
  }

  pagination(params?: any): Observable<ResponsePaginate<Commodity>> {
    return super.pagination(params);
  }

  getOne(id: any): Observable<Commodity> {
    return super.getOne(id);
  }

  update(id: any, body: any): Observable<Commodity> {
    return super.update(id, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
