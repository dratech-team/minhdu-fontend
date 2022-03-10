import {BaseService} from '@minhdu-fontend/service';
import {ProviderEntity} from '../entities/provider.entity';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {ResponsePaginate} from '@minhdu-fontend/data-models';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {AddProviderDto} from "../dto/add-provider.dto";
import {UpdateProviderDto} from "../dto/update-provider.dto";

@Injectable()
export class ProviderService extends BaseService<ProviderEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.WAREHOUSE.PROVIDER, http);
  }

  addOne(props: AddProviderDto): Observable<ProviderEntity> {
    return super.addOne(props);
  }

  getAll(params?: any): Observable<ProviderEntity[]> {
    return super.getAll(params);
  }

  pagination(params?: any): Observable<ResponsePaginate<ProviderEntity>> {
    return super.pagination(params);
  }

  update(id: number, body: UpdateProviderDto): Observable<ProviderEntity> {
    return super.update(id, body);
  }

  delete(id: number, params?: any): Observable<void> {
    return super.delete(id, params);
  }
}
