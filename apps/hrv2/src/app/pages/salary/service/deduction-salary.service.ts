import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponseMessageEntity } from '@minhdu-fontend/base-entity';
import { BaseService } from '@minhdu-fontend/service';
import { DeductionSalaryEntity } from '../entities/deduction-salary.entity';

@Injectable({ providedIn: 'root' })
export class DeductionSalaryService extends BaseService<DeductionSalaryEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.HR.PAYROLL.DEDUCTION_SALARY, http);
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
