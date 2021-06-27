import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Position } from '@minhdu-fontend/data-models';
import { BaseService } from '@minhdu-fontend/service';
import { Update } from '@ngrx/entity';

@Injectable()
export class PositionService extends BaseService<Position> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.POSITION, http);
  }

  addOne(props: Position): Observable<Position> {
    return super.addOne(props);
  }

  getAll(): Observable<any[]> {
    return super.getAll();
  }

  update(id: any, body: any): Observable<Update<Position>> {
    return super.update(id, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
