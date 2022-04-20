import {Injectable} from '@angular/core';
import {BaseService} from '@minhdu-fontend/service';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {ResponseSalaryEntity} from '../entities';
import {BaseAddAbsentSalaryDto, BaseUpdateAbsentDto} from '../dto';

@Injectable({providedIn: 'root'})
export class AbsentSalaryService extends BaseService<ResponseSalaryEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.PAYROLL.SALARY, http);
  }

  addOne(props: BaseAddAbsentSalaryDto): Observable<ResponseSalaryEntity> {
    return super.addOne(props);
  }

  updateMany(updateDto: Partial<BaseUpdateAbsentDto>): Observable<ResponseSalaryEntity> {
    return super.updateMany(updateDto);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
