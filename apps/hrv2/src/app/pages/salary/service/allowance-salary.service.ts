import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {AllowanceSalaryEntity} from "../entities";
import {ResponseMessageEntity} from "@minhdu-fontend/base-entity";
import {BaseSalaryService} from "./base-salary.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {Actions} from "@datorama/akita-ng-effects";
import {BaseService} from "@minhdu-fontend/service";

@Injectable({providedIn: 'root'})
export class AllowanceSalaryService extends BaseService<AllowanceSalaryEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super( Api.HR.PAYROLL.ALLOWANCE_SALARY, http);
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
