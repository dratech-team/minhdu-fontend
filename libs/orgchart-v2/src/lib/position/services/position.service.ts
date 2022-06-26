import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {ResponsePaginate} from '@minhdu-fontend/data-models';
import {BaseService} from '@minhdu-fontend/service';
import {PositionEntity} from "../entities/position.entity";
import {AddPositionDto, SearchPositionDto, UpdatePositionDto} from "../dto";

@Injectable({providedIn: 'root'})
export class PositionService extends BaseService<PositionEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.EMPLOYEE.POSITION, http);
  }
  pagination(params?: Partial<SearchPositionDto>): Observable<ResponsePaginate<PositionEntity>> {
    return super.pagination(params?.search);
  }

  addOne(props: AddPositionDto): Observable<PositionEntity> {
    return super.addOne(props.body);
  }


  getAll(prams?:SearchPositionDto): Observable<PositionEntity[]> {
    return super.getAll(prams?.search);
  }

  update(props: UpdatePositionDto): Observable<PositionEntity> {
    return super.update(props.id, props.updates);
  }

  delete(id: number, params?: any): Observable<void> {
    return super.delete(id, params);
  }
}
