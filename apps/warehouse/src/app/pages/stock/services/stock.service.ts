import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { Product } from '../entities';
import { AddStockDto, SearchStockDto } from '../dto';
import {UpdateStockDto} from "../dto";

@Injectable()
export class StockService extends BaseService<Product> {
  constructor(public readonly http: HttpClient) {
    super(Api.WAREHOUSE.PRODUCT, http);
  }

  addOne(props: AddStockDto): Observable<Product> {
    return super.addOne(props.body);
  }

  pagination(params?: SearchStockDto): Observable<ResponsePaginate<Product>> {
    return super.pagination(params);
  }

  getAll(params?: SearchStockDto): Observable<Product[]> {
    return super.getAll(params);
  }

  getOne(id: Product['id']): Observable<Product> {
    return super.getOne(id);
  }

  update(updateDto:UpdateStockDto): Observable<Product> {
    return super.update(updateDto.id, updateDto.updates);
  }

  delete(id: Product['id'], params?: any): Observable<void> {
    return super.delete(id, params);
  }

}
