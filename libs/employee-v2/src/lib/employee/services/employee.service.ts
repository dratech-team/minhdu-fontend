import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Api} from '@minhdu-fontend/constants';
import {ResponsePaginate} from '@minhdu-fontend/data-models';
import {BaseService} from 'libs/service/base.service';
import {EmployeeEntity} from "../entities";
import {AddEmployeeDto, LoadOneEmployeeDto, SearchEmployeeDto, UpdateEmployeeDto} from "../dto/employee";
import {ResponseMessageEntity} from "@minhdu-fontend/base-entity";
import {VersionEnum} from "@minhdu-fontend/enums";


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
    return this.http.patch<void>(this.url + `/${id}/leave`, body);
  }

  delete(id: number, params?: any): Observable<void> {
    return super.delete(id, params);
  }

  deleteWorkHistory(id: number): Observable<void> {
    return this.http.delete<void>(this.url + `/${id}/work-history`);
  }

  updateHistorySalary(id: number, body: any): Observable<ResponseMessageEntity> {
    return this.http.patch<ResponseMessageEntity>(VersionEnum.V2 + Api.HR.EMPLOYEE.HISTORY_SALARY + `/${id}`, body);
  }

  deleteHistorySalary(id: number): Observable<void> {
    return this.http.delete<void>(VersionEnum.V2 + Api.HR.EMPLOYEE.HISTORY_SALARY + `/${id}`);
  }
}
