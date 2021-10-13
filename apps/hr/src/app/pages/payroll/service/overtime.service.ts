import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { BaseService } from 'libs/service/base.service';
import { Overtime } from '../../../../../../../libs/data-models/hr/salary/overtime';

@Injectable({ providedIn: 'root' })
export class OvertimeService extends BaseService<Overtime> {
  constructor(public readonly http: HttpClient) {
    super(Api.OVERTIME, http);
  }

  getOvertime(params?: any): Observable<Overtime> {
    return this.http.get<Overtime>(Api.OVERTIME, {params});
  }
}
