import { BaseService } from '@minhdu-fontend/service';
import { Api } from '@minhdu-fontend/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import {Warehouse} from "../../../../shared/constant";

@Injectable()
export class WarehouseService extends BaseService<Warehouse> {
  constructor(public readonly http: HttpClient) {
    super(Api.WAREHOUSE.WAREHOUSE, http);
  }

  addOne(props: any): Observable<Warehouse> {
    return super.addOne(props);
  }

  getAll(params?: any): Observable<Warehouse[]> {
    return super.getAll(params);
  }

  pagination(params?: any): Observable<ResponsePaginate<Warehouse>> {
    return super.pagination(params);
  }
}
