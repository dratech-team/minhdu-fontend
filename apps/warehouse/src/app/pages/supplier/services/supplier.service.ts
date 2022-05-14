import { BaseService } from '@minhdu-fontend/service';
import { SupplierEntity } from '../entities';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AddSupplierDto } from '../dto';
import { UpdateSupplierDto } from '../dto';
import {SearchSupplierDto} from "../dto";

@Injectable()
export class SupplierService extends BaseService<SupplierEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.WAREHOUSE.SUPPLIER, http);
  }

  addOne(AddSupplierDto: AddSupplierDto): Observable<SupplierEntity> {
    return super.addOne(AddSupplierDto.body);
  }

  getAll(searchSupplierDto: SearchSupplierDto): Observable<SupplierEntity[]> {
    return super.getAll(searchSupplierDto.search);
  }

  pagination(searchSupplierDto: SearchSupplierDto): Observable<ResponsePaginate<SupplierEntity>> {
    return super.pagination(searchSupplierDto.search);
  }

  update( updateSupplierDto:UpdateSupplierDto): Observable<SupplierEntity> {
    return super.update(updateSupplierDto.id, updateSupplierDto.updates);
  }

  delete(id: number, params?: any): Observable<void> {
    return super.delete(id, params);
  }
}
