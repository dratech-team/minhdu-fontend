import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Api} from '@minhdu-fontend/constants';
import {ResponsePaginate, Salary} from '@minhdu-fontend/data-models';
import {BaseService} from 'libs/service/base.service';
import {EmployeeEntity} from "../entities";
import {AddEmployeeDto, LoadOneEmployeeDto, SearchEmployeeDto, UpdateEmployeeDto} from "../dto/employee";


@Injectable({providedIn: 'root'})
export class EmployeeService extends BaseService<EmployeeEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.EMPLOYEE.EMPLOYEE, http);
  }

  addOne(props: AddEmployeeDto): Observable<EmployeeEntity> {
    return super.addOne(props.body);
  }

  getOne(props: LoadOneEmployeeDto): Observable<EmployeeEntity> {
    return super.getOne(props.id);
  }

  pagination(props: SearchEmployeeDto): Observable<ResponsePaginate<EmployeeEntity>> {
    return super.pagination(props.search);
  }

  update(props: UpdateEmployeeDto): Observable<EmployeeEntity> {
    return super.update(props.id, props.updates).pipe(val => {
      return val;
    });
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

  updateHistorySalary(id: number, body: any): Observable<Salary> {
    return this.http.patch<Salary>(Api.HR.EMPLOYEE.HISTORY_SALARY + `/${id}`, body);
  }

  deleteHistorySalary(id: number): Observable<void> {
    return this.http.delete<void>(Api.HR.EMPLOYEE.HISTORY_SALARY + `/${id}`);
  }
}
