import { BaseService } from '@minhdu-fontend/service';
import { AllowanceBranchEntity } from '../entities/allowance-branch.entity';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { AddAllowanceBranchDto } from '../dto/add-allowance-branch.dto';
import { UpdateAllowanceBranchDto } from '../dto/update-allowance-branch.dto';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AllowanceBranchService extends BaseService<AllowanceBranchEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.HR.SALARY_BRANCH, http);
  }

  addOne(props: AddAllowanceBranchDto): Observable<AllowanceBranchEntity> {
    return super.addOne(props.body);
  }

  update(props: UpdateAllowanceBranchDto): Observable<AllowanceBranchEntity> {
    return super.update(props.id, props.updates);
  }

  delete(id: number, params?: any): Observable<void> {
    return super.delete(id, params);
  }
}
