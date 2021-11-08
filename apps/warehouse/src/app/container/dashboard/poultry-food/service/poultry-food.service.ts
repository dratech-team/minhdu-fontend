import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { UpdateNum } from '@ngrx/entity/src/models';
import { PoultryFood } from '../+state/poultry-food.interface';

@Injectable({ providedIn: 'root' })
export class PoultryFoodService extends BaseService<PoultryFood> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.POULTRY_FOOD, http);
  }

  addOne(props: PoultryFood): Observable<PoultryFood> {
    return super.addOne(props);
  }

  pagination(params: any): Observable<ResponsePaginate<PoultryFood>> {
    return super.pagination(params);
  }

  getOne(id: any): Observable<PoultryFood> {
    return super.getOne(id);
  }

  update(id: any, body: any): Observable<UpdateNum<PoultryFood>> {
    return super.update(id, body);
  }


  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
