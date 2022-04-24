import {Injectable} from '@angular/core';
import {BaseService} from '@minhdu-fontend/service';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {AllowanceSalaryEntity} from "../entities";
import {ResponseMessageEntity} from "@minhdu-fontend/base-entity";

@Injectable({providedIn: 'root'})
export class AllowanceSalaryService extends BaseService<AllowanceSalaryEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.PAYROLL.ALLOWANCE_SALARY, http);
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
