import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Api} from '@minhdu-fontend/constants';
import {Injectable} from '@angular/core';
import {ResponsePaginate} from '@minhdu-fontend/data-models';
import {BaseService} from '@minhdu-fontend/service';
import {RankEntity} from "../entities/rank.entity";
import {AddRankDto} from "../dto/rank/add-rank.dto";
import {SearchRankDto} from "../dto/rank/search-rank.dto";
import {LoadOneRankDto} from "../dto/rank/load-one-rank.dto";
import {UpdateRankDto} from "../dto/rank/update-rank.dto";

@Injectable({providedIn: 'root'})
export class RankService extends BaseService<RankEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.HR.EMPLOYEE.RANK, http);
  }


  addOne(props: AddRankDto): Observable<RankEntity> {
    return super.addOne(props.body);
  }

  pagination(props?: SearchRankDto): Observable<ResponsePaginate<RankEntity>> {
    return super.pagination(props?.search);
  }

  getAll(): Observable<RankEntity[]> {
    return super.getAll();
  }

  getOne(props: LoadOneRankDto): Observable<RankEntity> {
    return super.getOne(props.id);
  }

  update(props: UpdateRankDto): Observable<RankEntity> {
    return super.update(props.id, props.updates);
  }


  delete(id: number): Observable<any> {
    return super.delete(id);
  }
}
