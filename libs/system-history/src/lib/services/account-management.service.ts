import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Account } from '../+state/account-management/account.model';


@Injectable({ providedIn: 'root' })
export class AccountManagementService extends BaseService<Account> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.AUTH, http);
  }

  getAll(params?: any): Observable<Account[]> {
    return super.getAll(params);
  }
}
