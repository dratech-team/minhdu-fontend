import { BaseService } from '@minhdu-fontend/service';
import { ProviderEntity } from '../entities/provider.entity';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ProviderService extends BaseService<ProviderEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.WAREHOUSE.PROVIDER, http);
  }

  getAll(params?: any): Observable<ProviderEntity[]> {
    return super.getAll(params);
  }

  pagination(params?: any): Observable<ResponsePaginate<ProviderEntity>> {
    return super.pagination(params);
  }
}
