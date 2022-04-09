import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { IoiReceiptEntity } from '../entities';
import { AddIoiReceiptDto, SearchIoiReceiptDto } from '../dto';
import {UpdateIoiReceiptDto} from "../dto";

@Injectable()
export class IoiReceiptService extends BaseService<IoiReceiptEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.WAREHOUSE.IOI_RECEIPT, http);
  }

  addOne(props: AddIoiReceiptDto): Observable<IoiReceiptEntity> {
    return super.addOne(props.body);
  }

  pagination(params?: SearchIoiReceiptDto): Observable<ResponsePaginate<IoiReceiptEntity>> {
    return super.pagination(params);
  }

  getAll(params?: SearchIoiReceiptDto): Observable<IoiReceiptEntity[]> {
    return super.getAll(params);
  }

  getOne(id: IoiReceiptEntity['id']): Observable<IoiReceiptEntity> {
    return super.getOne(id);
  }

  update(updateDto:UpdateIoiReceiptDto): Observable<IoiReceiptEntity> {
    return super.update(updateDto.id, updateDto.updates);
  }

  delete(id: IoiReceiptEntity['id'], params?: any): Observable<void> {
    return super.delete(id, params);
  }

}
