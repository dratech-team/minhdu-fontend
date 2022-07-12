import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '@minhdu-fontend/constants';
import { Injectable } from '@angular/core';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { BaseService } from '@minhdu-fontend/service';
import { ContractEntity } from '../entities/contract.entity';
import { AddContractDto } from '../dto/contract/add-contract.dto';
import { SearchContractDto } from '../dto/contract/search-contract.dto';
import { LoadOneContractDto } from '../dto/contract/load-one-contract.dto';
import { UpdateContractDto } from '../dto/contract/update-contract.dto';

@Injectable({ providedIn: 'root' })
export class ContractService extends BaseService<ContractEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.HR.EMPLOYEE.CONTRACT, http);
  }

  addOne(props: AddContractDto): Observable<ContractEntity> {
    return super.addOne(props.body);
  }

  pagination(
    props?: SearchContractDto
  ): Observable<ResponsePaginate<ContractEntity>> {
    return super.pagination(props?.search);
  }

  getAll(): Observable<ContractEntity[]> {
    return super.getAll();
  }

  getOne(props: LoadOneContractDto): Observable<ContractEntity> {
    return super.getOne(props.id);
  }

  update(props: UpdateContractDto): Observable<ContractEntity> {
    return super.update(props.id, props.updates);
  }

  delete(id: number): Observable<any> {
    return super.delete(id);
  }
}
