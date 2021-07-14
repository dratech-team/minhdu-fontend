import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { Commodity } from '../+state/commodity.interface';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { Update } from '@ngrx/entity';

@Injectable({
  providedIn: 'root'
})
export class CommodityService extends BaseService<Commodity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.COMMODITY, http);
  }

  addOne(props: Commodity): Observable<Commodity> {
    return super.addOne(props);
  }

  pagination(params: any): Observable<ResponsePaginate<Commodity>> {
    return super.pagination(params);
  }

  getOne(id: any): Observable<Commodity> {
    return super.getOne(id);
  }

  update(id: any, body: any): Observable<Update<Commodity>> {
    return super.update(id, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
