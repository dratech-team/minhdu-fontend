import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '@minhdu-fontend/constants';
import { Injectable } from '@angular/core';
import {Branch, ResponsePaginate} from '@minhdu-fontend/data-models';
import { BaseService } from '@minhdu-fontend/service';
import {BranchEntity} from "../entities/branch.entity";
import {AddBranchDto, LoadOneBranchDto, SearchBranchDto, UpdateBranchDto} from "../dto";

@Injectable({providedIn:'root'})
export class BranchService extends BaseService<BranchEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.EMPLOYEE.BRANCH, http);
  }


  addOne(addBranchDto: AddBranchDto): Observable<BranchEntity> {
    return super.addOne(addBranchDto.body);
  }

  pagination(searchBranchDto?: SearchBranchDto):Observable<ResponsePaginate<BranchEntity>> {
    return super.pagination(searchBranchDto?.search);
  }

  getAll(): Observable<BranchEntity[]> {
    return super.getAll();
  }

  getOne(loadOneDto: LoadOneBranchDto): Observable<BranchEntity> {
    return super.getOne(loadOneDto.id);
  }

  update(updateBranchDto:UpdateBranchDto): Observable<BranchEntity> {
    return super.update(updateBranchDto.id, updateBranchDto.updates);
  }


  delete(id: number): Observable<any> {
    return super.delete(id);
  }

  deleteAllowanceInBranch(salaryId: number): Observable<BranchEntity> {
    return this.http.delete<BranchEntity>(Api.HR.PAYROLL.BRANCH_ALLOWANCE + `/${salaryId}`);
  }
}
