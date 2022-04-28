import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {ResponseMessageEntity} from "@minhdu-fontend/base-entity";
import {RemoteSalaryEntity} from "../entities";
import {BaseService} from "@minhdu-fontend/service";

@Injectable({providedIn: 'root'})
export class SalaryRemoteService extends BaseService<RemoteSalaryEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.PAYROLL.SALARY_REMOTE, http);
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
