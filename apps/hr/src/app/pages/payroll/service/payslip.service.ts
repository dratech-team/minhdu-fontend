import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {Payslip} from '../+state/payslip/payslip.interface';
import {VersionEnum} from "@minhdu-fontend/enums";

@Injectable({providedIn: 'root'})
export class PayslipService {
  constructor(
    public readonly http: HttpClient,
  ) {
  }

  getOne(id: any): Observable<Payslip> {
    return this.http.get<Payslip>(VersionEnum.V2 + Api.HR.PAYROLL.PAYROLL + `/${id}/` + Api.HR.PAYROLL.PAYSLIP);
  }
}
