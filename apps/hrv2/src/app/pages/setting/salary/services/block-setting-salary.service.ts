import {Injectable} from '@angular/core';
import {BaseService} from '@minhdu-fontend/service';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {BlockSettingSalaryEntity} from "../entities";

@Injectable({providedIn: 'root'})
export class BlockSettingSalaryService extends BaseService<BlockSettingSalaryEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.BLOCK_SETTING_SALARY, http);
  }

  getAll(): Observable<BlockSettingSalaryEntity[]> {
    return super.getAll();
  }
}
