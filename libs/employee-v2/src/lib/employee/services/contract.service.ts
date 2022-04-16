import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '@minhdu-fontend/constants';
import { BaseService } from 'libs/service/base.service';

@Injectable({ providedIn: 'root' })
export class ContractService extends BaseService<any> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.EMPLOYEE.CONTRACT, http);
  }
  addOne(props: any): Observable<any> {
  return super.addOne(props);
  }

  update(id: any, body: any): Observable<any> {
   return super.update(id, body);
 }
}
