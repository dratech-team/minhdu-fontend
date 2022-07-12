import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { SalarySettingEntity } from '../entities';
import {
  AddSalarySettingDto,
  SearchSalarySettingDto,
  UpdateSalarySettingDto,
} from '../dto';

@Injectable({ providedIn: 'root' })
export class SalarySettingService extends BaseService<SalarySettingEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.HR.SETTING_SALARY, http);
  }

  pagination(
    params: Partial<SearchSalarySettingDto>
  ): Observable<ResponsePaginate<SalarySettingEntity>> {
    return super.pagination(params?.search);
  }

  addOne(addDto: AddSalarySettingDto): Observable<SalarySettingEntity> {
    return super.addOne(addDto.body);
  }

  getAll(): Observable<SalarySettingEntity[]> {
    return super.getAll();
  }

  update(props: UpdateSalarySettingDto): Observable<SalarySettingEntity> {
    return super.update(props.id, props.updates);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
