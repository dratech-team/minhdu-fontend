import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Api} from '@minhdu-fontend/constants';
import {Injectable} from '@angular/core';
import {ResponsePaginate} from '@minhdu-fontend/data-models';
import {BaseService} from '@minhdu-fontend/service';
import {SettingBonusEntity} from "../entities/setting-bonus.entity";
import {AddSettingBonusDto} from "../dto/setting-bonus/add-setting-bonus.dto";
import {SearchSettingBonusDto} from "../dto/setting-bonus/search-setting-bonus.dto";
import {LoadOneSettingBonusDto} from "../dto/setting-bonus/load-one-setting-bonus.dto";
import {UpdateSettingBonusDto} from "../dto/setting-bonus/update-setting-bonus.dto";

@Injectable({providedIn: 'root'})
export class SettingBonusService extends BaseService<SettingBonusEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.EMPLOYEE.SETTING_BONUS, http);
  }


  addOne(props: AddSettingBonusDto): Observable<SettingBonusEntity> {
    return super.addOne(props.body);
  }

  pagination(props?: SearchSettingBonusDto): Observable<ResponsePaginate<SettingBonusEntity>> {
    return super.pagination(props?.search);
  }

  getAll(): Observable<SettingBonusEntity[]> {
    return super.getAll();
  }

  getOne(props: LoadOneSettingBonusDto): Observable<SettingBonusEntity> {
    return super.getOne(props.id);
  }

  update(props: UpdateSettingBonusDto): Observable<SettingBonusEntity> {
    return super.update(props.id, props.updates);
  }


  delete(id: number): Observable<any> {
    return super.delete(id);
  }
}
