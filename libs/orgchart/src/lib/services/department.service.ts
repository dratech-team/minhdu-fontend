import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepartmentEntity } from '@minhdu-fontend/orgchart';
import { Api } from '@minhdu-fontend/constants';

@Injectable()
export class DepartmentService {
  constructor(private readonly http: HttpClient) {
  }

  addOne(name: string, branchId: number): Observable<DepartmentEntity> {
    return this.http.post<any>(Api.DEPARTMENT, { name, branchId });
  }

  getAll(): Observable<DepartmentEntity[]> {
    return this.http.get<DepartmentEntity[]>(Api.DEPARTMENT);
  }

  update(id: number, name: string): Observable<DepartmentEntity> {
    return this.http.patch<any>(Api.DEPARTMENT + `/${id}`, { name });
  }
}
