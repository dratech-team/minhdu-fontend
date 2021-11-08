import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Material } from '../+state/material.interface';

@Injectable({ providedIn: 'root' })
export class MaterialService extends BaseService<Material> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.MATERIAL, http);
  }

  addOne(props: Material): Observable<Material> {
    return super.addOne(props);
  }

  pagination(params: any): Observable<ResponsePaginate<Material>> {
    return super.pagination(params);
  }

  getOne(id: any): Observable<Material> {
    return super.getOne(id);
  }

  update(id: any, body: any): Observable<UpdateNum<Material>> {
    return super.update(id, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
