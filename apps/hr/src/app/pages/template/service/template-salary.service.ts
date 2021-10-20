import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity/src/models';
import { TemplateSalary } from '../+state/teamlate-salary/template-salary';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';

@Injectable({ providedIn: 'root' })
export class TemplateSalaryService extends BaseService<TemplateSalary> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.BASIC_TEMPLATE, http);
  }

  pagination(params?: any): Observable<ResponsePaginate<TemplateSalary>> {
    return super.pagination(params);
  }

  addOne(props: any): Observable<TemplateSalary> {
    return super.addOne(props);
  }

  getAll(): Observable<TemplateSalary[]> {
    return super.getAll();
  }

  update(id: any, body: any): Observable<Update<TemplateSalary>> {
    return super.update(id, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
