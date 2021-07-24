import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { TemplateOvertime } from '../+state/template-overtime/template-overtime.interface';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';
import { Holiday } from '../+state/holiday/holiday.interface';

@Injectable({providedIn:'root'})
export class HolidayService extends BaseService<Holiday>{
  constructor(
    public readonly http: HttpClient,
  ) {
    super(Api.holiday,http)
  }

  addOne(props: Holiday): Observable<Holiday> {
    return super.addOne(props);
  }

  getAll(): Observable<Holiday[]> {
    return super.getAll();
  }
  update(id: any, body: any): Observable<Update<Holiday>> {
    return super.update(id, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }

}
