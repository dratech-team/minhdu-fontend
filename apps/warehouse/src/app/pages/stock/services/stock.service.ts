import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { stockEntity } from '../entities';
import { AddStockDto, SearchStockDto } from '../dto';
import {UpdateStockDto} from "../dto";

@Injectable()
export class StockService extends BaseService<stockEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.WAREHOUSE.PRODUCT, http);
  }

  addOne(props: AddStockDto): Observable<stockEntity> {
    return super.addOne(props.body);
  }

  pagination(params?: SearchStockDto): Observable<ResponsePaginate<stockEntity>> {
    return super.pagination(params);
  }

  getAll(params?: SearchStockDto): Observable<stockEntity[]> {
    return super.getAll(params);
  }

  getOne(id: stockEntity['id']): Observable<stockEntity> {
    return super.getOne(id);
  }

  update(updateDto:UpdateStockDto): Observable<stockEntity> {
    return super.update(updateDto.id, updateDto.updates);
  }

  delete(id: stockEntity['id'], params?: any): Observable<void> {
    return super.delete(id, params);
  }

}
