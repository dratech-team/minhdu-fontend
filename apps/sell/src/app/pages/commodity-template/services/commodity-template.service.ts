import {Injectable} from '@angular/core';
import {BaseService} from '@minhdu-fontend/service';
import {CommodityTemplateEntity} from '../entities';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {AddCommodityTemplateDto} from "../dto/add-commodity-template.dto";
import {ResponsePaginate} from "@minhdu-fontend/data-models";
import {SearchCommodityTemplateDto} from "../dto/search-commodity-template.dto";
import {UpdateCommodityTemplateDto} from "../dto/update-commodity-template.dto";
import {LoadOneCommodityTemplateDto} from "../dto/load-one-commodity-template.dto";

@Injectable({ providedIn: 'root' })
export class CommodityTemplateService extends BaseService<CommodityTemplateEntity> {
  constructor(public http: HttpClient) {
    super(Api.SELL.COMMODITY_TEMPLATE, http);
  }

  addOne(addBranchDto: AddCommodityTemplateDto): Observable<CommodityTemplateEntity> {
    return super.addOne(addBranchDto.body);
  }

  pagination(props?: SearchCommodityTemplateDto): Observable<ResponsePaginate<CommodityTemplateEntity>> {
    return super.pagination(props?.search);
  }

  getAll(params?: any): Observable<CommodityTemplateEntity[]> {
    return super.getAll(params);
  }

  getOne(loadOneDto: LoadOneCommodityTemplateDto): Observable<CommodityTemplateEntity> {
    return super.getOne(loadOneDto.id);
  }

  update(updateBranchDto: UpdateCommodityTemplateDto): Observable<CommodityTemplateEntity> {
    return super.update(updateBranchDto.id, updateBranchDto.updates);
  }


  delete(id: number): Observable<any> {
    return super.delete(id);
  }
}
