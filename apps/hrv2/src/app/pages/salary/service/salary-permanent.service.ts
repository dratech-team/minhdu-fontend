import {Injectable} from '@angular/core';
import {BaseService} from '@minhdu-fontend/service';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {ResponseSalaryEntity} from '../entities';
import {BaseAddPermanentSalaryDto} from "../dto/permanent-salary/add-permanent-salary.dto";
import {BaseUpdatePermanentDto} from "../dto";

@Injectable({providedIn: 'root'})
export class SalaryPermanentService extends BaseService<ResponseSalaryEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.PAYROLL.SALARY, http);
  }

  addOne(props:Partial<BaseAddPermanentSalaryDto>): Observable<ResponseSalaryEntity> {
    return this.http.post<ResponseSalaryEntity>(Api.HR.PAYROLL.SALARY + '/create', props);
  }

  updateMany(body: Partial<BaseUpdatePermanentDto>): Observable<ResponseSalaryEntity> {
    return this.http.post<ResponseSalaryEntity>(Api.HR.PAYROLL.SALARY + '/update', body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
