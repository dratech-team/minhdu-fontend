import {Injectable} from '@angular/core';
import {BaseService} from '@minhdu-fontend/service';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {ResponseSalaryEntity} from '../entities';
import {BaseAddOvertimeSalaryDto} from "../dto/overtime-salary/add-overtime-salary.dto";
import {BaseUpdateOvertimeDto} from "../dto/overtime-salary/update-overtime-salary.dto";

@Injectable({providedIn: 'root'})
export class OvertimeSalaryService extends BaseService<ResponseSalaryEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.PAYROLL.OVERTIME_SALARY, http);
  }

  addOne(props: BaseAddOvertimeSalaryDto): Observable<ResponseSalaryEntity> {
    return super.addOne(props);
  }

  updateMany(body: Partial<BaseUpdateOvertimeDto>): Observable<ResponseSalaryEntity> {
    return super.updateMany(body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
