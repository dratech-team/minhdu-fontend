import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { AccountEntity } from '../entities/account.entity';
import { SearchAccountDto } from '../dto/account/search-account.dto';
import { LoadOneAccountDto } from '../dto/account/load-one-account.dto';
import { UpdateAccountDto } from '../dto/account/update-account.dto';
import { AddAccountDto } from '../dto/account/add-account.dto';
import { SignInDto } from '../dto/account/sign-in.dto';
import { VersionEnum } from '@minhdu-fontend/enums';

@Injectable({ providedIn: 'root' })
export class AccountService extends BaseService<AccountEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.AUTH, http);
  }

  signUp(props: AddAccountDto): Observable<AccountEntity> {
    return this.http.post<any>(VersionEnum.V1 + Api.SIGN_UP, props.body);
  }

  pagination(props: SearchAccountDto): Observable<any> {
    return super.pagination(props.isSet);
  }

  getAll(props: SearchAccountDto): Observable<AccountEntity[]> {
    return super.getAll(props.search);
  }

  getOne(props: LoadOneAccountDto): Observable<AccountEntity> {
    return super.getOne(props.id);
  }

  update(props: UpdateAccountDto): Observable<AccountEntity> {
    return super.update(props.id, props.updates);
  }

  delete(id: number, params?: any): Observable<void> {
    return super.delete(id, params);
  }

  signIn(body: SignInDto): Observable<any> {
    return this.http.post<any>(VersionEnum.V1 + Api.SIGN_IN, body);
  }

  updatePassword(id: number, body: any): Observable<any> {
    return this.http.patch<any>(this.url + '/change-password', body);
  }
}
