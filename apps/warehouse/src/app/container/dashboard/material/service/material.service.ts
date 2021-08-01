import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { Update } from '@ngrx/entity/src/models';
import { Appliance } from '../+state/material.interface';

@Injectable({ providedIn: 'root' })
export class MaterialService extends BaseService<Appliance> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.APPLIANCE, http);
  }

  addOne(props: Appliance): Observable<Appliance> {
    return super.addOne(props);
  }

  pagination(params: any): Observable<ResponsePaginate<Appliance>> {
    return super.pagination(params);
  }

  getOne(id: any): Observable<Appliance> {
    return super.getOne(id);
  }

  update(id: any, body: any): Observable<Update<Appliance>> {
    return super.update(id, body);
  }


  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
