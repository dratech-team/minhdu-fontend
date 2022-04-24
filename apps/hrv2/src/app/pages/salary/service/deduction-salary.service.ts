import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {DeductionSalaryEntity} from "../entities";
import {ResponseMessageEntity} from "@minhdu-fontend/base-entity";
import {Actions} from "@datorama/akita-ng-effects";
import {NzMessageService} from "ng-zorro-antd/message";
import {BaseSalaryService} from "./base-salary.service";

@Injectable({providedIn: 'root'})
export class DeductionSalaryService extends BaseSalaryService<DeductionSalaryEntity> {
  constructor(
    public readonly http: HttpClient,
    public readonly message: NzMessageService,
    public readonly actions$: Actions
  ) {
    super(message, actions$, Api.HR.PAYROLL.DEDUCTION_SALARY, http);
  }

  addMany(body: any, addOne?: { payrollId: number }): Observable<ResponseMessageEntity> {
    return super.addMany(body, addOne)
  }

  updateMany(body: any, updateOne?: { payrollId: number }): Observable<ResponseMessageEntity> {
    return super.updateMany(body, updateOne);
  }

  deleteMany(body: any): Observable<ResponseMessageEntity> {
    return super.deleteMany(body);
  }
}
