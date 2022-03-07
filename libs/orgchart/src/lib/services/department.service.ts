import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '@minhdu-fontend/constants';
import { Branch, Department } from '@minhdu-fontend/data-models';
import { BaseService } from '@minhdu-fontend/service';
import { UpdateNum } from '@ngrx/entity/src/models';

@Injectable()
export class DepartmentService extends BaseService<Department> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.EMPLOYEE.DEPARTMENT, http);
  }


  addOne(props: any): Observable<Department> {
    return super.addOne(props);
  }

  getAll(): Observable<Department[]> {
    return super.getAll();
  }

  getOne(id: any): Observable<Department> {
    return super.getOne(id);
  }

  update(id: number, body: any): Observable<Department> {
    return super.update(id, body);
  }

  delete(id: number): Observable<any> {
    return super.delete(id);
  }
}
