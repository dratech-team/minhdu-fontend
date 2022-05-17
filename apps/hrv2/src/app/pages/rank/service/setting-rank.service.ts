import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Api} from '@minhdu-fontend/constants';
import {Injectable} from '@angular/core';
import {ResponsePaginate} from '@minhdu-fontend/data-models';
import {BaseService} from '@minhdu-fontend/service';
import {SettingRankEntity} from "../entities/setting-rank.entity";
import {AddSettingRankDto} from "../dto/setting-rank/add-setting-rank.dto";
import {SearchSettingRankDto} from "../dto/setting-rank/search-setting-rank.dto";
import {LoadOneSettingRankDto} from "../dto/setting-rank/load-one-setting-rank.dto";
import {UpdateSettingRankDto} from "../dto/setting-rank/update-setting-rank.dto";

@Injectable({providedIn: 'root'})
export class SettingRankService extends BaseService<SettingRankEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.EMPLOYEE.SETTING_RANK, http);
  }


  addOne(props: AddSettingRankDto): Observable<SettingRankEntity> {
    return super.addOne(props.body);
  }

  pagination(props?: SearchSettingRankDto): Observable<ResponsePaginate<SettingRankEntity>> {
    return super.pagination(props?.search);
  }

  getAll(): Observable<SettingRankEntity[]> {
    return super.getAll();
  }

  getOne(props: LoadOneSettingRankDto): Observable<SettingRankEntity> {
    return super.getOne(props.id);
  }

  update(props: UpdateSettingRankDto): Observable<SettingRankEntity> {
    return super.update(props.id, props.updates);
  }


  delete(id: number): Observable<any> {
    return super.delete(id);
  }
}
