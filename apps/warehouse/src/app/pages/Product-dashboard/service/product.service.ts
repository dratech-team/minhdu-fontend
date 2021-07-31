import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { Update } from '@ngrx/entity/src/models';
import { Product } from '../+state/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService extends BaseService<Product> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.PRODUCT, http);
  }

  addOne(props: Product): Observable<Product> {
    return super.addOne(props);
  }

  pagination(params: any): Observable<ResponsePaginate<Product>> {
    return super.pagination(params);
  }

  getOne(id: any): Observable<Product> {
    return super.getOne(id);
  }

  update(id: any, body: any): Observable<Update<Product>> {
    return super.update(id, body);
  }


  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
