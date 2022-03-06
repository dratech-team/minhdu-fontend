import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { UpdateNum } from '@ngrx/entity/src/models';
import {RouteEntity} from "../entities/route.entity";
import {AddRouteDto} from "../dto/add-route.dto";
import {UpdateRouteDto} from "../dto/update-route.dto";

@Injectable({providedIn: 'root'})
export  class RouteService extends BaseService<RouteEntity>{
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.SELL.ROUTE.ROUTE , http);
  }
  addOne(props: AddRouteDto): Observable<RouteEntity> {
    return super.addOne(props);
  }
  pagination(params: any): Observable<ResponsePaginate<RouteEntity>> {
    return super.pagination(params);
  }
  getOne(id: any): Observable<RouteEntity> {
    return super.getOne(id);
  }

  updateRoute(id: number, body:Partial<UpdateRouteDto>): Observable<RouteEntity> {
     return this.http.patch <RouteEntity>(Api.SELL.ROUTE.ROUTE + `/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
