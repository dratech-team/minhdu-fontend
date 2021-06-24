import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Position } from '@minhdu-fontend/data-models';

@Injectable()
export class PositionService {
  constructor(private readonly http: HttpClient) {
  }

  addOne(name: string, workday: number, departmentId: number): Observable<Position> {
    console.log(name, workday, departmentId);
    return this.http.post<any>(Api.POSITION, { name, workday, departmentId });
  }

  getAll(): Observable<Position[]> {
    return this.http.get<Position[]>(Api.POSITION);
  }

  update(id: number, name: string): Observable<Position> {
    return this.http.patch<Position>(Api.POSITION + `/${id}`, { name });
  }
}
