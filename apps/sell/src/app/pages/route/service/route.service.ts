import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { Route } from '../container/+state/route.interface';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { Update } from '@ngrx/entity';

@Injectable({providedIn: 'root'})
export  class RouteService extends BaseService<Route>{
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.ROUTE , http);
  }
  addOne(props: Route): Observable<Route> {
    return super.addOne(props);
  }
  pagination(params: any): Observable<ResponsePaginate<Route>> {
    return super.pagination(params);
  }
  getOne(id: any): Observable<Route> {
    return super.getOne(id);
  }
  update(id: any, body: any): Observable<Update<Route>> {
    return super.update(id, body);
  }
  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
