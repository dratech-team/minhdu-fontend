import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Api} from '@minhdu-fontend/constants';
import {BaseService} from 'libs/service/base.service';
import {AddDegreeDto, UpdateDegreeDto} from "../dto/degree";
import {EmployeeEntity} from "../entities";
import {VersionEnum} from "@minhdu-fontend/enums";

@Injectable({providedIn: 'root'})
export class DegreeService extends BaseService<EmployeeEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.EMPLOYEE.DEGREE, http);
  }

  addOneDegree(props: AddDegreeDto): Observable<EmployeeEntity> {
    return this.http.post<EmployeeEntity>(this.url, props.body);
  }

  update(props: UpdateDegreeDto): Observable<EmployeeEntity> {
    return super.update(props.id, props.updates);
  }


  deleteDegree(id: number): Observable<EmployeeEntity> {
    return this.http.delete<EmployeeEntity>(this.url + `/${id}`);
  }

  deleteContracts(id: number): Observable<void> {
    return this.http.delete<void>(VersionEnum.V2 + Api.HR.EMPLOYEE.CONTRACT + `/${id}`);
  }
}
