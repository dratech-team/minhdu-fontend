import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService extends BaseService<Product> {
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