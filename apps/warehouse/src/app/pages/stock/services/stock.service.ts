import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { sotckEntity } from '../entities';
import { AddStockDto, SearchStockDto } from '../dto';
import {UpdateStockDto} from "../dto";

@Injectable()
export class StockService extends BaseService<sotckEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.WAREHOUSE.PRODUCT, http);
  }

  addOne(props: AddStockDto): Observable<sotckEntity> {
    return super.addOne(props.body);
  }

  pagination(params?: SearchStockDto): Observable<ResponsePaginate<sotckEntity>> {
    return super.pagination(params);
  }

  getAll(params?: SearchStockDto): Observable<sotckEntity[]> {
    return super.getAll(params);
  }

  getOne(id: sotckEntity['id']): Observable<sotckEntity> {
    return super.getOne(id);
  }

  update(updateDto:UpdateStockDto): Observable<sotckEntity> {
    return super.update(updateDto.id, updateDto.updates);
  }

  delete(id: sotckEntity['id'], params?: any): Observable<void> {
    return super.delete(id, params);
  }

}
