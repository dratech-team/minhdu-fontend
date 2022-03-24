import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '@minhdu-fontend/constants';
import { Employee, ResponsePaginate } from '@minhdu-fontend/data-models';
import { BaseService } from 'libs/service/base.service';


@Injectable({ providedIn: 'root' })
export class EmployeeService extends BaseService<Employee> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.EMPLOYEE.EMPLOYEE, http);
  }

  addOne(employee: any): Observable<Employee> {
    return super.addOne(employee);
  }

  getOne(id: number): Observable<Employee> {
    return super.getOne(id);
  }

  pagination(params: any): Observable<ResponsePaginate<Employee>> {
    return super.pagination(params);
  }

  update(id: number, props: any): Observable<Employee> {
    return super.update(id, props).pipe(val => {
      return val;
    });
  }

  updateRelative(employeeId: number, props: any): Observable<Employee> {
    return super.update(employeeId, props);
  }

  leaveEmployee(id: number, body?: any): Observable<void> {
    return this.http.patch<void>(Api.HR.EMPLOYEE.EMPLOYEE + `/${id}/leave`, body);
  }

  delete(id: number, params?: any): Observable<void> {
    return super.delete(id, params);
  }

  deleteWorkHistory(id: number): Observable<void> {
    return this.http.delete<void>(Api.HR.EMPLOYEE.EMPLOYEE + `/${id}/work-history`);
  }
}
