import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '@minhdu-fontend/constants';
import { Department } from '@minhdu-fontend/data-models';

@Injectable()
export class DepartmentService {
  constructor(private readonly http: HttpClient) {
  }

  addOne(name: string, branchId: number): Observable<Department> {
    return this.http.post<any>(Api.DEPARTMENT, { name, branchId });
  }

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(Api.DEPARTMENT);
  }

  update(id: number, name: string): Observable<Department> {
    return this.http.patch<any>(Api.DEPARTMENT + `/${id}`, { name });
  }
}
