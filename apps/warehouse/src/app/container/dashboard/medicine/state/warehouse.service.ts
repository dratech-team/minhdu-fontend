import { BaseService } from '@minhdu-fontend/service';
import { Api } from '@minhdu-fontend/constants';
import { HttpClient } from '@angular/common/http';
import { Product } from './warehouse/entities/product.entity';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ResponsePaginate } from '@minhdu-fontend/data-models';

@Injectable()
export class WarehouseService extends BaseService<Product> {
  constructor(public readonly http: HttpClient) {
    super(Api.WAREHOUSE.PRODUCT, http);
  }

  addOne(props: any): Observable<Product> {
    return super.addOne(props);
  }

  getAll(params?: any): Observable<Product[]> {
    return super.getAll(params);
  }

  pagination(params?: any): Observable<ResponsePaginate<Product>> {
    return super.pagination(params);
  }
}
