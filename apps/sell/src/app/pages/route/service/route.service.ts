import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { UpdateNum } from '@ngrx/entity/src/models';
import {CreateRouteDto} from "../entities/create-route-dto.entity";
import {SearchRouteDto} from "../entities/search-route-dto.entity";
import {Route} from "../entities/route.entity";

@Injectable({providedIn: 'root'})
export  class RouteService extends BaseService<Route>{
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.SELL.ROUTE.ROUTE , http);
  }
  addOne(props: CreateRouteDto): Observable<Route> {
    return super.addOne(props);
  }
  pagination(params: SearchRouteDto): Observable<ResponsePaginate<Route>> {
    return super.pagination(params);
  }
  getOne(id: any): Observable<Route> {
    return super.getOne(id);
  }
  update(id: any, body: any): Observable<UpdateNum<Route>> {
    return super.update(id, body);
  }
  delete(id: number): Observable<Route> {
    return super.delete(id);
  }
}
