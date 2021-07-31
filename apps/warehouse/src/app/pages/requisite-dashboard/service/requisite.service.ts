import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { Update } from '@ngrx/entity/src/models';
import { Requisite } from '../+state/requisite .interface';

@Injectable({ providedIn: 'root' })
export class RequisiteService extends BaseService<Requisite> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.REQUISITE, http);
  }

  addOne(props: Requisite): Observable<Requisite> {
    return super.addOne(props);
  }

  pagination(params: any): Observable<ResponsePaginate<Requisite>> {
    return super.pagination(params);
  }

  getOne(id: any): Observable<Requisite> {
    return super.getOne(id);
  }

  update(id: any, body: any): Observable<Update<Requisite>> {
    return super.update(id, body);
  }


  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
