import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { Product } from '../entities';
import { AddProductDto, SearchProductDto, UpdateProductDto } from '../dto';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(public readonly http: HttpClient) {
    super(Api.WAREHOUSE.PRODUCT, http);
  }

  addOne(props: AddProductDto): Observable<Product> {
    return super.addOne(props);
  }

  pagination(params?: SearchProductDto): Observable<ResponsePaginate<Product>> {
    return super.pagination(params);
  }

  getAll(params?: SearchProductDto): Observable<Product[]> {
    return super.getAll(params);
  }

  getOne(id: Product['id']): Observable<Product> {
    return super.getOne(id);
  }

  update(id: Product['id'], body: UpdateProductDto): Observable<Product> {
    return super.update(id, body);
  }

  delete(id: Product['id'], params?: any): Observable<void> {
    return super.delete(id, params);
  }

}
