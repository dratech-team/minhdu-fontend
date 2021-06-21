import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { PositionEntity } from '@minhdu-fontend/orgchart';

@Injectable()
export class PositionService {
  constructor(private readonly http: HttpClient) {
  }

  addOne(name: string, workday: number, departmentId: number): Observable<PositionEntity> {
    console.log(name, workday, departmentId);
    return this.http.post<any>(Api.POSITION, { name, workday, departmentId });
  }

  getAll(): Observable<PositionEntity[]> {
    return this.http.get<PositionEntity[]>(Api.POSITION);
  }

  update(id: number, name: string): Observable<PositionEntity> {
    return this.http.patch<PositionEntity>(Api.POSITION + `/${id}`, { name });
  }
}
