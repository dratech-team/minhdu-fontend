import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { PayslipCT2, PayslipCT1 } from '../+state/payslip/payslip.interface';

@Injectable({providedIn:'root'})
export class PayslipService  {
  constructor(
    public readonly http: HttpClient,
  ) {
  }

 getOneCT1(id: any): Observable<PayslipCT1> {
   return this.http.get<PayslipCT1>(Api.PAYROLL + `/${id}/` + Api.PAYSLIP);
 }
  getOneCT2(id: any): Observable<PayslipCT2> {
    return this.http.get<PayslipCT2>(Api.PAYROLL + `/${id}/` + Api.PAYSLIP);
  }
}
