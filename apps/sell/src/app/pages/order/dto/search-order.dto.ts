import {PaidType} from "@minhdu-fontend/enums";
import {SearchRangeDto} from "../../../shared/dto";

export interface SearchOrderDto extends SearchRangeDto {
  readonly take?: number;
  readonly skip?: number;
  readonly customerId?: number;
  status?: 0 | 1 | -1;
  orderBy?: string,
  orderType?: string,
  search?: string,
  paidType?: PaidType | '',
  customer?: string,
  explain?: string,
  commodityTotal?: number,
  province?: string,
  bsx?: string,
  commodity?: string
}
