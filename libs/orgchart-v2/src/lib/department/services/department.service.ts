import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Api} from '@minhdu-fontend/constants';
import {Injectable} from '@angular/core';
import {BaseService} from '@minhdu-fontend/service';
import {DepartmentEntity} from "@minhdu-fontend/orgchart-v2";
import {AddDepartmentDto, LoadOneDepartmentDto, UpdateDepartmentDto} from "../dto";

@Injectable({providedIn: 'root'})
export class DepartmentService extends BaseService<DepartmentEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.EMPLOYEE.CATEGORY, http);
  }


  addOne(props: AddDepartmentDto): Observable<DepartmentEntity> {
    return super.addOne(props.body)
  }

  update(props: UpdateDepartmentDto): Observable<DepartmentEntity> {
    return super.update(props.id, props.updates)
  }

  getAll(params?: any): Observable<DepartmentEntity[]> {
    return super.getAll(params);
  }

  getOne(props: LoadOneDepartmentDto): Observable<DepartmentEntity> {
    return super.getOne(props.id);
  }

  delete(id: number, params?: any): Observable<void> {
    return super.delete(id, params);
  }

  removeEmployee(id: number, body: any): Observable<any> {
    return this.http.patch<any>(this.url + `/${id}/employee`, body)
  }
}
