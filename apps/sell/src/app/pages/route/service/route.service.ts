import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { UpdateNum } from '@ngrx/entity/src/models';
import {Route} from "../+state/route.interface";

@Injectable({providedIn: 'root'})
export  class RouteService extends BaseService<Route>{
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.SELL.ROUTE.ROUTE , http);
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
  update(id: any, body: any): Observable<UpdateNum<Route>> {
    return super.update(id, body);
  }
  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
