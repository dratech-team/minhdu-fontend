import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../../../service/base.service';
import { Update } from '@ngrx/entity/src/models';
import { Employee } from '../+state/employee.interface';
import { Api } from '@minhdu-fontend/constants';
import { ResponsePaginate } from '@minhdu-fontend/data-models';

@Injectable({ providedIn: 'root' })
export class EmployeeService extends BaseService<Employee> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.EMPLOYEE, http);
  }

  addOne(employee: Employee | undefined): Observable<Employee> {
    return super.addOne(employee);
  }

  pagination(params: any): Observable<ResponsePaginate<Employee>> {
    return super.pagination(params);
  }

  update(id: number, props: Employee | undefined): Observable<Update<Employee>> {
    return super.update(id, props);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
