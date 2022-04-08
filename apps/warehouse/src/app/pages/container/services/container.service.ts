import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { ContainerEntity } from '../entities';
import { AddContainerDto, SearchContainerDto } from '../dto';
import {UpdateContainerDto} from "../dto";

@Injectable()
export class ContainerService extends BaseService<ContainerEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.WAREHOUSE.PRODUCT, http);
  }

  addOne(props: AddContainerDto): Observable<ContainerEntity> {
    return super.addOne(props.body);
  }

  pagination(searchProductDto?: SearchContainerDto): Observable<ResponsePaginate<ContainerEntity>> {
    return super.pagination(searchProductDto?.search);
  }

  getAll(searchProductDto: SearchContainerDto): Observable<ContainerEntity[]> {
    return super.getAll(searchProductDto.search);
  }

  getOne(id: ContainerEntity['id']): Observable<ContainerEntity> {
    return super.getOne(id);
  }

  update(updateDto:UpdateContainerDto): Observable<ContainerEntity> {
    return super.update(updateDto.id, updateDto.updates);
  }

  delete(id: ContainerEntity['id'], params?: any): Observable<void> {
    return super.delete(id, params);
  }

}
