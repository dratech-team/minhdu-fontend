import { BaseService } from '@minhdu-fontend/service';
import { Api } from '@minhdu-fontend/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {ResponsePaginate} from '@minhdu-fontend/data-models';
import {WarehouseEntity} from "../entities";
import {AddWarehouseDto} from "../dto";

@Injectable()
export class CategoryService extends BaseService<WarehouseEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.WAREHOUSE.CATEGORY, http);
  }

  addOne(props: AddWarehouseDto): Observable<WarehouseEntity> {
    return super.addOne(props.body);
  }

  getAll(params?: any): Observable<WarehouseEntity[]> {
    return super.getAll(params);
  }

  pagination(params?: any): Observable<ResponsePaginate<WarehouseEntity>> {
    return super.pagination(params);
  }
}
