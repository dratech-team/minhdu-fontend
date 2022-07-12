import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { OvertimeSalaryEntity } from '../entities';
import { ResponseMessageEntity } from '@minhdu-fontend/base-entity';
import { BaseService } from '@minhdu-fontend/service';

@Injectable({ providedIn: 'root' })
export class OvertimeSalaryService extends BaseService<OvertimeSalaryEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.HR.PAYROLL.OVERTIME_SALARY, http);
  }

  addMany(body: any): Observable<ResponseMessageEntity> {
    return super.addMany(body);
  }

  updateMany(body: any): Observable<ResponseMessageEntity> {
    return super.updateMany(body, 'put');
  }

  deleteMany(body: any): Observable<ResponseMessageEntity> {
    return super.deleteMany(body);
  }
}
