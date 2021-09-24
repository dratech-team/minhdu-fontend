import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { TemplateOvertime } from '../+state/template-overtime/template-overtime.interface';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { TemplateSalaryBasic } from '../+state/teamlate-salary-basic/template-salary-basic';

@Injectable({providedIn:'root'})
export class TemplateBasicSalaryService extends BaseService<TemplateSalaryBasic>{
  constructor(
    public readonly http: HttpClient,
  ) {
    super(Api.BASIC_TEMPLATE,http)
  }

  addOne(props: TemplateSalaryBasic): Observable<TemplateSalaryBasic> {
    return super.addOne(props);
  }

  getAll(): Observable<TemplateSalaryBasic[]> {
    return super.getAll();
  }
  updateBasicSalary(id: any, body: any): Observable<TemplateSalaryBasic> {
    return this.http.patch<TemplateSalaryBasic>(this.url + `/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
