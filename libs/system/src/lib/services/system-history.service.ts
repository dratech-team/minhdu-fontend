import {Injectable} from '@angular/core';
import {BaseService} from '@minhdu-fontend/service';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {ResponsePaginate,} from '@minhdu-fontend/data-models';
import {SystemHistoryEntity} from "../entities/system-history.entity";
import {SearchSystemHistoryDto} from "../dto/system-history/search-system-history.dto";
import {AddSystemHistoryDto} from "../dto/system-history/add-system-history.dto";
import {UpdateSystemHistoryDto} from "../dto/system-history/update-system-history.dto";


@Injectable({providedIn:'root'})
export class SystemHistoryService extends BaseService<SystemHistoryEntity>{
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.LOGGER , http);
  }

  addOne(props: AddSystemHistoryDto): Observable<SystemHistoryEntity> {
    return super.addOne(props.body);
  }

  getAll(props: SearchSystemHistoryDto): Observable<SystemHistoryEntity[]> {
    return super.getAll(props.search);
  }

  pagination(props: SearchSystemHistoryDto): Observable<ResponsePaginate<SystemHistoryEntity>> {
    return super.pagination(props.search);
  }

  update(props: UpdateSystemHistoryDto): Observable<SystemHistoryEntity> {
    return super.update(props.id, props.updates);
  }

  delete(id: number, params?: any): Observable<void> {
    return super.delete(id, params);
  }

}
