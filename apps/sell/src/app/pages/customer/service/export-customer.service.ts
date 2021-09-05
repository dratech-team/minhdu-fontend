import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export  class ExportCustomerService extends BaseService<any>{
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.CUSTOMER_EXPORT , http);
  }
  print(param: any): Observable<any> {
    return super.getAll(param);
  }
}
