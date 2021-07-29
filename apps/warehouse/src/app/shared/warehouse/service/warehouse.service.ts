import { BaseService } from '@minhdu-fontend/service';
import { Warehouse } from '@minhdu-fontend/data-models';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';

@Injectable({providedIn: 'root'})
export class WarehouseService extends BaseService<Warehouse> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.WAREHOUSE, http);
  }
  addOne(props: Warehouse): Observable<Warehouse> {
    return super.addOne(props);
  }

  getAll(params?: any): Observable<Warehouse[]> {
    return super.getAll(params);
  }
  getOne(id: any): Observable<Warehouse> {
    return super.getOne(id);
  }
  update(id: any, body: any): Observable<Update<Warehouse>> {
    return super.update(id, body);
  }
  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
