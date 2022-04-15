import {Injectable} from '@angular/core';
import {BaseService} from '@minhdu-fontend/service';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {ResponsePaginate} from '@minhdu-fontend/data-models';
import {SettingSalaryEntity} from "../entities";
import {AddSettingSalaryDto, SearchSettingSalaryDto, UpdateSettingSalaryDto} from "../dto";

@Injectable({providedIn: 'root'})
export class SettingSalaryService extends BaseService<SettingSalaryEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.SETTING_SALARY, http);
  }

  pagination(params?: SearchSettingSalaryDto): Observable<ResponsePaginate<SettingSalaryEntity>> {
    return super.pagination(params?.search);
  }

  addOne(addDto: AddSettingSalaryDto): Observable<SettingSalaryEntity> {
    return super.addOne(addDto.body);
  }

  getAll(): Observable<SettingSalaryEntity[]> {
    return super.getAll();
  }

  update(props: UpdateSettingSalaryDto): Observable<SettingSalaryEntity> {
    return super.update(props.id, props.updates);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
