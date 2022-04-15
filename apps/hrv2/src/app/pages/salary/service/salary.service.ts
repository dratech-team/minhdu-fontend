import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { SalaryEntity } from '../entities';
import { AddSalaryDto } from '../dto';
import { UpdateSalaryDto } from '../dto';

@Injectable({ providedIn: 'root' })
export class SalaryService extends BaseService<SalaryEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.PAYROLL.SALARY, http);
  }

  addOne(props: AddSalaryDto): Observable<SalaryEntity> {
    return super.addOne(props.body);
  }

  update(updateDto:UpdateSalaryDto): Observable<SalaryEntity> {
    return super.update(updateDto.id, updateDto.updates);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
