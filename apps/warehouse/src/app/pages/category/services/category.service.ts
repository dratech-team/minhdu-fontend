import { BaseService } from '@minhdu-fontend/service';
import { Api } from '@minhdu-fontend/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {ResponsePaginate} from '@minhdu-fontend/data-models';
import {CategoryEntity} from "../entities";
import {AddCategoryDto} from "../dto";

@Injectable()
export class CategoryService extends BaseService<CategoryEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.WAREHOUSE.WAREHOUSE, http);
  }

  addOne(props: AddCategoryDto): Observable<CategoryEntity> {
    return super.addOne(props.body);
  }

  getAll(params?: any): Observable<CategoryEntity[]> {
    return super.getAll(params);
  }

  pagination(params?: any): Observable<ResponsePaginate<CategoryEntity>> {
    return super.pagination(params);
  }
}
