import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Api} from '@minhdu-fontend/constants';
import {Employee, ResponsePaginate, Salary} from '@minhdu-fontend/data-models';
import {BaseService} from 'libs/service/base.service';
import {VersionEnum} from "@minhdu-fontend/enums";


@Injectable({providedIn: 'root'})
export class EmployeeService extends BaseService<Employee> {
  url = VersionEnum.V2 + Api.HR.EMPLOYEE.EMPLOYEE
  urlHistory = VersionEnum.V2 + Api.HR.EMPLOYEE.HISTORY_SALARY

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
    return this.http.patch<void>(this.url + `/${id}/leave`, body);
  }

  delete(id: number, params?: any): Observable<void> {
    return super.delete(id, params);
  }

  deleteWorkHistory(id: number): Observable<void> {
    return this.http.delete<void>(this.url + `/${id}/work-history`);
  }

  updateHistorySalary(id: number, body: any): Observable<Salary> {
    return this.http.patch<Salary>(this.urlHistory + `/${id}`, body);
  }

  deleteHistorySalary(id: number): Observable<void> {
    return this.http.delete<void>(this.urlHistory + `/${id}`);
  }
}
