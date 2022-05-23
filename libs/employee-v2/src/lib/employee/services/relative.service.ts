import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Api} from '@minhdu-fontend/constants';
import {BaseService} from 'libs/service/base.service';
import {EmployeeEntity} from "../entities";
import {AddRelativeDto} from "../dto/relative";
import {UpdateDegreeDto} from "../dto/degree";
import {RelativeEntity} from "../entities/relative.entity";

@Injectable({ providedIn: 'root' })
export class RelativeService extends BaseService<RelativeEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.EMPLOYEE.RELATIVE, http);
  }

  addOneRelative(props: AddRelativeDto): Observable<RelativeEntity> {
    return this.http.post<RelativeEntity>(this.url, props.body);
  }

  update(props: UpdateDegreeDto): Observable<RelativeEntity> {
    return super.update(props.id, props.updates);
  }

  deleteRelative(id: number): Observable<void> {
    return super.delete(id);
  }
}
