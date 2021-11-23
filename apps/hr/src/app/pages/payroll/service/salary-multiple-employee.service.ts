import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Salary } from '@minhdu-fontend/data-models';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';
import { BaseService } from 'libs/service/base.service';

@Injectable({ providedIn: 'root' })
export class SalaryMultipleEmployeeService extends BaseService<Salary> {
  constructor(public readonly http: HttpClient) {
    super(Api.HR.PAYROLL.SALARY_EMPLOYEES, http);
  }

  addOne(salary: any): Observable<Salary | any> {
    return super.addOne(salary);
  }
}
