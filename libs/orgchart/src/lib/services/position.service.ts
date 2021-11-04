import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Position, ResponsePaginate } from '@minhdu-fontend/data-models';
import { BaseService } from '@minhdu-fontend/service';
import { UpdateNum } from '@ngrx/entity/src/models';

@Injectable()
export class PositionService extends BaseService<Position> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.POSITION, http);
  }
  pagination(params?: any): Observable<ResponsePaginate<Position>> {
    return super.pagination(params);
  }

  addOne(props: any): Observable<Position> {
    return super.addOne(props);
  }


  getAll(prams?:any): Observable<any[]> {
    return super.getAll(prams);
  }

  update(id: any, body: any): Observable<UpdateNum<Position>> {
    return super.update(id, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
