import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeStore } from '../state/employee.store';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { map } from 'rxjs/operators';
import { BaseService } from '../../service/base.service';
import { Api } from '../../../../../../libs/shared/constants/api.contain';


@Injectable({providedIn:'root'})
export class EmployeeService extends BaseService<Employee>{
  constructor(
    public readonly http: HttpClient,
    private readonly employeeStore: EmployeeStore,
  ) {
    super(Api.EMPLOYEE, http, employeeStore)
  }

  update(id: string , props: any): Observable<Employee> {
    return super.update(id, props)
  }
  addOne(props: any): Observable<Employee> {
    return super.addOne(props);
  }
  getAllEmployee(params: any): Observable<Employee[]> {
    return this.http.get<Employee[]  >('/employee', {params}).pipe(map((res)=> res));
  }
}
