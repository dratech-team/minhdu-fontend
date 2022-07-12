import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Holiday } from '../../template/+state/holiday/holiday.interface';
import { ResponsePaginate } from '@minhdu-fontend/data-models';

@Injectable({ providedIn: 'root' })
export class HolidayService extends BaseService<Holiday> {
  constructor(public readonly http: HttpClient) {
    super(Api.HR.PAYROLL.holiday, http);
  }

  addOne(props: Holiday): Observable<Holiday> {
    return super.addOne(props);
  }

  pagination(params?: any): Observable<ResponsePaginate<Holiday>> {
    return super.pagination(params);
  }

  getAll(): Observable<Holiday[]> {
    return super.getAll();
  }
  update(id: any, body: any): Observable<Holiday> {
    return super.update(id, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }

  getOneHoliday(id: any, params: any): Observable<Holiday> {
    return this.http.get<Holiday>(Api.HR.PAYROLL.holiday + `/${id}`, {
      params,
    });
  }
}
