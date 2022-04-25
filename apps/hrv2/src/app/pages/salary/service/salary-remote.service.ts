import {Injectable} from '@angular/core';
import {BaseService} from '@minhdu-fontend/service';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {ResponseMessageEntity} from "@minhdu-fontend/base-entity";
import {PermanentSalaryEntity} from "../entities";
import {BaseSalaryService} from "./base-salary.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {Actions} from "@datorama/akita-ng-effects";

@Injectable({providedIn: 'root'})
export class SalaryRemoteService extends BaseSalaryService<PermanentSalaryEntity> {
  constructor(
    public readonly http: HttpClient,
    public readonly message: NzMessageService,
    public readonly actions$: Actions
  ) {
    super(message,actions$,Api.HR.PAYROLL.SALARY_REMOTE, http);
  }

  addMany(body: any, addOne?: { payrollId: number }): Observable<ResponseMessageEntity> {
    return super.addMany(body, addOne);
  }

  updateMany(body: any, updateOne?: { payrollId: number }): Observable<ResponseMessageEntity> {
    return super.updateMany(body, updateOne);
  }

  deleteMany(body: number[]): Observable<ResponseMessageEntity> {
    return super.deleteMany(body);
  }
}
