import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponseMessageEntity } from '@minhdu-fontend/base-entity';
import { PermanentSalaryEntity } from '../entities';
import { VersionEnum } from '@minhdu-fontend/enums';

@Injectable({ providedIn: 'root' })
export class SalaryPermanentService extends BaseService<PermanentSalaryEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.HR.PAYROLL.SALARY_V2, http, VersionEnum.V2);
  }

  addMany(body: any): Observable<ResponseMessageEntity> {
    return super.addMany(body);
  }

  updateMany(body: any): Observable<ResponseMessageEntity> {
    return super.updateMany(body);
  }

  deleteMany(body: any): Observable<ResponseMessageEntity> {
    return super.deleteMany(body);
  }
}
