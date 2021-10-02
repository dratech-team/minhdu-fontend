import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Payslip } from '../+state/payslip/payslip.interface';

@Injectable({providedIn:'root'})
export class GenerateService  {
  constructor(
    public readonly http: HttpClient,
  ) {
  }

 generate(): Observable<any> {
   return this.http.get<any>(Api.GENERATE);
 }
}
