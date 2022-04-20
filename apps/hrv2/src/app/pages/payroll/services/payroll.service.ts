import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Api} from '@minhdu-fontend/constants';
import {ResponsePaginateOvertimePayroll} from '@minhdu-fontend/data-models';
import {BaseService} from 'libs/service/base.service';
import {Observable} from 'rxjs';
import {PayrollEntity} from "../entities";
import {AddPayrollDto, LoadOnePayrollDto, RemovePayrollDto, UpdatePayrollDto} from "../dto";
import {ConfirmPayrollDto} from "../dto/confirm-payroll.dto";

@Injectable({providedIn: 'root'})
export class PayrollService extends BaseService<PayrollEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.HR.PAYROLL.PAYROLL, http);
  }

  addPayroll(props: AddPayrollDto): Observable<any> {
    return this.http.post<any>(this.url, props.generate, {params: props.generate.employeeType});
  }

  getOne(props: LoadOnePayrollDto): Observable<PayrollEntity> {
    return super.getOne(props.id);
  }

  paginationPayroll(params?: any): Observable<ResponsePaginateOvertimePayroll<PayrollEntity>> {
    return this.http.get<ResponsePaginateOvertimePayroll<PayrollEntity>>(Api.HR.PAYROLL.PAYROLL,
      {params})
  }

  update(props: UpdatePayrollDto): Observable<PayrollEntity> {
    return super.update(props.id, props.updates);
  }

  confirmPayroll(props: ConfirmPayrollDto): Observable<PayrollEntity> {
    return this.http.patch<PayrollEntity>(Api.HR.PAYROLL.CONFIRM_PAYROLL + `/${props.id}`, props.data);
  }

  delete(props: RemovePayrollDto): Observable<void> {
    return super.delete(props.id);
  }

  generate(params?: any): Observable<any> {
    return this.http.get<any>(Api.HR.PAYROLL.GENERATE, {params});
  }

  scanHoliday(PayrollId: number): Observable<PayrollEntity> {
    return this.http.get<PayrollEntity>(
      Api.HR.PAYROLL.PAYROLL + `/${PayrollId}/` + Api.HR.PAYROLL.GENERATE_HOLIDAY
    );
  }
}
