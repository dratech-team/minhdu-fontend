import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate,  } from '@minhdu-fontend/data-models';
import { SystemHistory } from '../+state/system-history/system-history/system-history.model';



@Injectable({providedIn:'root'})
export class SystemHistoryService extends BaseService<SystemHistory>{
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.LOGGER , http);
  }
  pagination(params: any): Observable<ResponsePaginate<SystemHistory>> {
    return super.pagination(params);
  }
}
