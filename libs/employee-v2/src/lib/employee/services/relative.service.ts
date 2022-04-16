import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Api } from '@minhdu-fontend/constants';
import { Employee, Relative } from '@minhdu-fontend/data-models';
import { BaseService } from 'libs/service/base.service';
import {EmployeeEntity} from "../entities";
import {AddRelativeDto} from "../dto/relative";
import {UpdateDegreeDto} from "../dto/degree";

@Injectable({ providedIn: 'root' })
export class RelativeService extends BaseService<EmployeeEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.EMPLOYEE.RELATIVE, http);
  }

  addOneRelative(props: AddRelativeDto): Observable<EmployeeEntity> {
    return this.http.post<EmployeeEntity>(this.url, props.body);
  }

  update(props: UpdateDegreeDto): Observable<EmployeeEntity> {
    return super.update(props.id, props.updates);
  }

  deleteRelative(id: number): Observable<EmployeeEntity> {
    return this.http.delete<EmployeeEntity>(Api.HR.EMPLOYEE.RELATIVE + `/${id}`);
  }

}
