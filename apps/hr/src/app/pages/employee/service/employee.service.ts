import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../../../service/base.service';
import { Update } from '@ngrx/entity/src/models';
import { Employee } from '../+state/employee/employee.interface';
import { Api } from '@minhdu-fontend/constants';
import { ResponsePaginate } from '@minhdu-fontend/data-models';

@Injectable({ providedIn: 'root' })
export class EmployeeService extends BaseService<Employee> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.EMPLOYEE, http);
  }

  addOne(employee: any): Observable<Employee> {
    return super.addOne(employee);
  }
  addRelative(Relative: any): Observable<Employee> {
    return this.http.post<Employee>(Api.EMPLOYEE ,  Relative);
  }
  getOne(id: number): Observable<Employee> {
    return super.getOne(id);
  }

  pagination(params: any): Observable<ResponsePaginate<Employee>> {
    return super.pagination(params);
  }

  update(id: number, props: any ): Observable<Update<Employee>> {
    return super.update(id, props);
  }
  updateRelative(employeeId: number, props: any ): Observable<Update<Employee>> {
    return super.update(employeeId, props);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }

  deleteRelative(id: number, employeeId: number): Observable<void> {
    return super.delete(id)
  }

}
