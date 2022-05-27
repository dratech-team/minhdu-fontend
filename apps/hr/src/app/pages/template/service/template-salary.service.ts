import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { UpdateNum } from '@ngrx/entity/src/models';
import { SalarySetting } from '../+state/teamlate-salary/salary-setting';
import { ResponsePaginate } from '@minhdu-fontend/data-models';

@Injectable({ providedIn: 'root' })
export class TemplateSalaryService extends BaseService<SalarySetting> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.TEMPLATE.BASIC_TEMPLATE, http);
  }

  pagination(params?: any): Observable<ResponsePaginate<SalarySetting>> {
    return super.pagination(params);
  }

  addOne(props: any): Observable<SalarySetting> {
    return super.addOne(props);
  }

  getAll(): Observable<SalarySetting[]> {
    return super.getAll();
  }

  update(id: any, body: any): Observable<SalarySetting> {
    return super.update(id, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
