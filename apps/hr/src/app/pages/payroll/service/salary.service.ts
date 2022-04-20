import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Salary } from '@minhdu-fontend/data-models';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';
import { BaseService } from 'libs/service/base.service';
import { UpdateNum } from '@ngrx/entity/src/models';

@Injectable({ providedIn: 'root' })
export class SalaryService extends BaseService<Salary> {
  constructor(public readonly http: HttpClient) {
    super(Api.HR.PAYROLL.SALARY, http);
  }

  addOne(salary: any): Observable<Salary | any> {
    return super.addOne(salary);
  }

  getOne(id: any): Observable<Salary> {
    return super.getOne(id);
  }

  update(id: any, body: any): Observable<Salary> {
    return super.update(id, body);
  }

  updateSalary (body: any): Observable<Salary>{
    return this.http.post<Salary>(this.url + `/multiple`, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }

  updateMultipleSalaryOvertime(body: any): Observable<any>{
    return this.http.patch<Observable<any>>('salary/salaries/ids', body);
  }
}
