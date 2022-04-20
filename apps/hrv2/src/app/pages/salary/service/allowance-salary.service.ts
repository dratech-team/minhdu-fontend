import {Injectable} from '@angular/core';
import {BaseService} from '@minhdu-fontend/service';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {ResponseSalaryEntity} from '../entities';
import {BaseAddAllowanceSalaryDto} from "../dto/allowance-salary/add-allowance-salary.dto";
import {BaseUpdateAllowanceDto} from "../dto/allowance-salary/update-allowance-salary.dto";

@Injectable({providedIn: 'root'})
export class AllowanceSalaryService extends BaseService<ResponseSalaryEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.PAYROLL.ALLOWANCE_SALARY, http);
  }

  addOne(props: BaseAddAllowanceSalaryDto): Observable<ResponseSalaryEntity> {
    return super.addOne(props);
  }

  updateMany(body: Partial<BaseUpdateAllowanceDto>): Observable<ResponseSalaryEntity> {
    return super.updateMany(body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
