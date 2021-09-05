import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import {  Statistical } from '@minhdu-fontend/data-models';
import { Observable } from 'rxjs';

@Injectable({providedIn:'root'})
export class ChickenPrintService extends BaseService<Statistical>{
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.STATISTICAL_CHICKEN_PRINT, http)
  }
  print(param: any): Observable<Statistical[]> {
    return super.getAll(param);
  }
}
