import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Api} from '@minhdu-fontend/constants';
import {BaseService} from 'libs/service/base.service';
import {AddDegreeDto, UpdateDegreeDto} from "../dto/degree";
import {VersionEnum} from "@minhdu-fontend/enums";
import {DegreeEntity} from "../entities/degree.entity";

@Injectable({providedIn: 'root'})
export class DegreeService extends BaseService<DegreeEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.EMPLOYEE.DEGREE, http);
  }

  addOneDegree(props: AddDegreeDto): Observable<DegreeEntity> {
    return this.http.post<DegreeEntity>(this.url, props.body);
  }

  update(props: UpdateDegreeDto): Observable<DegreeEntity> {
    return super.update(props.id, props.updates);
  }


  deleteDegree(id: number): Observable<void> {
    return super.delete(id);
  }
}
