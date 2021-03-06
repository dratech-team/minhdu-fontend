import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { StockEntity } from '../entities';
import { AddStockDto, SearchStockDto } from '../dto';
import { UpdateStockDto } from '../dto';

@Injectable()
export class StockService extends BaseService<StockEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.WAREHOUSE.STOCK, http);
  }

  addOne(props: AddStockDto): Observable<StockEntity> {
    return super.addOne(props.body);
  }

  pagination(
    searchProductDto?: SearchStockDto
  ): Observable<ResponsePaginate<StockEntity>> {
    return super.pagination(searchProductDto?.search);
  }

  getAll(searchProductDto: SearchStockDto): Observable<StockEntity[]> {
    return super.getAll(searchProductDto.search);
  }

  getOne(id: StockEntity['id']): Observable<StockEntity> {
    return super.getOne(id);
  }

  update(updateDto: UpdateStockDto): Observable<StockEntity> {
    return super.update(updateDto.id, updateDto.updates);
  }

  delete(id: StockEntity['id'], params?: any): Observable<void> {
    return super.delete(id, params);
  }
}
