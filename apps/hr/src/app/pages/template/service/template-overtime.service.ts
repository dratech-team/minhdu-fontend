import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { TemplateOvertime } from '../+state/template-overtime/template-overtime.interface';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';
import { ResponsePaginate } from '@minhdu-fontend/data-models';

@Injectable({providedIn:'root'})
export class TemplateOvertimeService extends BaseService<TemplateOvertime>{
  constructor(
    public readonly http: HttpClient,
  ) {
    super(Api.OVERTIME_TEMPLATE,http)
  }
  pagination(params?: any): Observable<ResponsePaginate<TemplateOvertime>> {
    return super.pagination(params);
  }

  addOne(props: TemplateOvertime): Observable<TemplateOvertime> {
    return super.addOne(props);
  }

  getAll(): Observable<TemplateOvertime[]> {
    return super.getAll();
  }
  update(id: any, body: any): Observable<Update<TemplateOvertime>> {
    return super.update(id, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
