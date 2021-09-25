import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { TemplateOvertime } from '../+state/template-overtime/template-overtime.interface';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { TemplateBasicSalary } from '../+state/teamlate-salary-basic/template-basic-salary';
import { Update } from '@ngrx/entity/src/models';

@Injectable({providedIn:'root'})
export class TemplateBasicSalaryService extends BaseService<TemplateBasicSalary>{
  constructor(
    public readonly http: HttpClient,
  ) {
    super(Api.BASIC_TEMPLATE,http)
  }

  addOne(props: any): Observable<TemplateBasicSalary> {
    return super.addOne(props);
  }

  getAll(): Observable<TemplateBasicSalary[]> {
    return super.getAll();
  }
  update(id: any, body: any): Observable<Update<TemplateBasicSalary>> {
    return super.update(id, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
