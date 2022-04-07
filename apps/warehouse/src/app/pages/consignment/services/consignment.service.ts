import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { ConsignmentEntity } from '../entities';
import { AddConsignmentDto, SearchConsignmentDto } from '../dto';
import {UpdateConsignmentDto} from "../dto";

@Injectable()
export class ConsignmentService extends BaseService<ConsignmentEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.WAREHOUSE.CONSIGNMENT, http);
  }

  addOne(props: AddConsignmentDto): Observable<ConsignmentEntity> {
    return super.addOne(props.body);
  }

  pagination(searchProductDto?: SearchConsignmentDto): Observable<ResponsePaginate<ConsignmentEntity>> {
    return super.pagination(searchProductDto?.search);
  }

  getAll(searchProductDto: SearchConsignmentDto): Observable<ConsignmentEntity[]> {
    return super.getAll(searchProductDto.search);
  }

  getOne(id: ConsignmentEntity['id']): Observable<ConsignmentEntity> {
    return super.getOne(id);
  }

  update(updateDto:UpdateConsignmentDto): Observable<ConsignmentEntity> {
    return super.update(updateDto.id, updateDto.updates);
  }

  delete(id: ConsignmentEntity['id'], params?: any): Observable<void> {
    return super.delete(id, params);
  }

}
