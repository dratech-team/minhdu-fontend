import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { BaseRouteEntity } from '../entities';
import { AddRouteDto, CancelDto, UpdateRouteDto } from '../dto';

@Injectable({ providedIn: 'root' })
export class RouteService extends BaseService<BaseRouteEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.SELL.ROUTE.ROUTE, http);
  }

  addOne(props: AddRouteDto): Observable<BaseRouteEntity> {
    return super.addOne(props.body);
  }

  pagination(params: any): Observable<ResponsePaginate<BaseRouteEntity>> {
    return super.pagination(params);
  }

  getOne(id: any): Observable<BaseRouteEntity> {
    return super.getOne(id);
  }

  update(updateDto: UpdateRouteDto): Observable<BaseRouteEntity> {
    return super.update(updateDto.id, updateDto.updates);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }

  cancel(routeId: number, body: CancelDto): Observable<BaseRouteEntity> {
    return this.http.patch<BaseRouteEntity>(this.url + `/${routeId}/cancel`, body);
  }
}
