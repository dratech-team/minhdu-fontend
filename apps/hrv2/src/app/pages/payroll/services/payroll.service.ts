import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Api} from '@minhdu-fontend/constants';
import {ResponsePaginateOvertimePayroll} from '@minhdu-fontend/data-models';
import {BaseService} from 'libs/service/base.service';
import {Observable} from 'rxjs';
import {PayrollEntity} from "../entities";
import {LoadOnePayrollDto, UpdatePayrollDto} from "../dto";
import {ConfirmPayrollDto} from "../dto/confirm-payroll.dto";
import {ResponseMessageEntity} from "@minhdu-fontend/base-entity";
import {VersionEnum} from "@minhdu-fontend/enums";

@Injectable({providedIn: 'root'})
export class PayrollService extends BaseService<PayrollEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.HR.PAYROLL.PAYROLL, http, VersionEnum.V3);
  }

  addOne(props: any): Observable<PayrollEntity> {
    return super.addOne(props);
  }

  addMany(body: { createdAt: Date }): Observable<ResponseMessageEntity> {
    return super.addMany(body);
  }

  getOne(props: LoadOnePayrollDto): Observable<PayrollEntity> {
    return super.getOne(props.id);
  }

  paginationPayroll(params?: any): Observable<ResponsePaginateOvertimePayroll<PayrollEntity>> {
    return this.http.get<ResponsePaginateOvertimePayroll<PayrollEntity>>(VersionEnum.V3 + Api.HR.PAYROLL.PAYROLL,
      {params})
  }

  update(props: UpdatePayrollDto): Observable<PayrollEntity> {
    return super.update(props.id, props.updates);
  }

  confirm(props: ConfirmPayrollDto): Observable<PayrollEntity> {
    return this.http.patch<PayrollEntity>(VersionEnum.V3 + Api.HR.PAYROLL.CONFIRM_PAYROLL + `/${props.id}`, props.data);
  }

  delete(id: number, params?: any): Observable<void> {
    return super.delete(id, params);
  }

  scanHoliday(PayrollId: number): Observable<PayrollEntity> {
    return this.http.get<PayrollEntity>(
      VersionEnum.V3 + Api.HR.PAYROLL.PAYROLL + `/${PayrollId}/` + Api.HR.PAYROLL.GENERATE_HOLIDAY
    );
  }

  cancelConfirm(id: number, body?: any): Observable<any> {
    return this.http.patch<any>(VersionEnum.V3 + Api.HR.PAYROLL.CANCEL_CONFIRM + `/${id}`, body);
  }

  restore(id: number, body?: any): Observable<ResponseMessageEntity> {
    return this.http.patch<ResponseMessageEntity>(VersionEnum.V3 + Api.HR.PAYROLL.RESTORE_PAYROLL + `/${id}`, body);
  }
}
