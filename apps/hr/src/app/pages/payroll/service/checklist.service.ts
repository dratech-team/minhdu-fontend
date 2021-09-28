import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Payslip } from '../+state/payslip/payslip.interface';

@Injectable({providedIn:'root'})
export class ChecklistService  {
  constructor(
    public readonly http: HttpClient,
  ) {
  }

 timekeeping(body: any): Observable<any> {
   return this.http.post<any>(Api.CHECKLIST, body);
 }
}
