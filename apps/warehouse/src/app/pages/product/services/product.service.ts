import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { ProductEntity } from '../entities';
import { AddProductDto, SearchProductDto } from '../dto';
import {UpdateProductDto} from "../dto";

@Injectable()
export class ProductService extends BaseService<ProductEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.WAREHOUSE.PRODUCT, http);
  }

  addOne(props: AddProductDto): Observable<ProductEntity> {
    return super.addOne(props.body);
  }

  pagination(params?: SearchProductDto): Observable<ResponsePaginate<ProductEntity>> {
    return super.pagination(params);
  }

  getAll(params?: SearchProductDto): Observable<ProductEntity[]> {
    return super.getAll(params?.search);
  }

  getOne(id: ProductEntity['id']): Observable<ProductEntity> {
    return super.getOne(id);
  }

  update(updateDto:UpdateProductDto): Observable<ProductEntity> {
    return super.update(updateDto.id, updateDto.updates);
  }

  delete(id: ProductEntity['id'], params?: any): Observable<void> {
    return super.delete(id, params);
  }

}
