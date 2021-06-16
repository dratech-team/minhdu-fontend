import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { BaseService } from '../../service/base.service';
import { Api } from '../../../../../../libs/shared/constants/api.contain';
import { ResponsePaginate } from '@minhdu-fontend/data-models';


@Injectable({providedIn:'root'})
export class EmployeeService extends BaseService<Employee>{
  constructor(
    public readonly http: HttpClient,
  ) {
    super(Api.EMPLOYEE, http)
  }

  update(id: number , props: Employee|undefined): Observable<Employee> {
    return super.update(id, props)
  }
  addOne(employee: Employee|undefined): Observable<Employee> {
    return super.addOne(employee);
  }
  getAllEmployee(params: any): Observable<ResponsePaginate<Employee>> {
      return super.pagination(params)
  }
  delete(id:number): Observable<void> {
    return super.delete(id)
  }
}
