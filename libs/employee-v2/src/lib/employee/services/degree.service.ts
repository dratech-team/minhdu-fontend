import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateNum } from '@ngrx/entity/src/models';
import { Api } from '@minhdu-fontend/constants';
import { Degree, Employee } from '@minhdu-fontend/data-models';
import { BaseService } from 'libs/service/base.service';
import {AddDegreeDto, RemoveDegreeDto, UpdateDegreeDto} from "../dto/degree";
import {EmployeeEntity} from "../entities";

@Injectable({ providedIn: 'root' })
export class DegreeService extends BaseService<EmployeeEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.EMPLOYEE.DEGREE, http);
  }

  addOneDegree(props: AddDegreeDto): Observable<EmployeeEntity> {
    return this.http.post<EmployeeEntity>(Api.HR.EMPLOYEE.DEGREE, props.body);
  }

  update(props: UpdateDegreeDto): Observable<EmployeeEntity> {
    return super.update(props.id, props.updates);
  }


  deleteDegree(id: number): Observable<EmployeeEntity>{
    return this.http.delete<EmployeeEntity>(Api.HR.EMPLOYEE.DEGREE + `/${id}`);
  }

  deleteContracts(id: number): Observable<void>{
    return this.http.delete<void>(Api.HR.EMPLOYEE.CONTRACT + `/${id}`);
  }
}
