import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Salary } from '@minhdu-fontend/data-models';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';
import { BaseService } from 'libs/service/base.service';

@Injectable({ providedIn: 'root' })
export class SalaryService extends BaseService<Salary> {
  constructor(public readonly http: HttpClient) {
    super(Api.SALARY, http);
  }

  addOne(salary: any): Observable<Salary> {
    return super.addOne(salary);
  }

  getOne(id: any): Observable<Salary> {
    return super.getOne(id);
  }

  update(id: any, body: any): Observable<Update<Salary>> {
    return super.update(id, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
