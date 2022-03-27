import {SearchRangeDto} from "../../../shared/dto";

export interface SearchRouteDto  extends SearchRangeDto{
  take?: number;
  skip?: number;
  orderId?: number;
  status?: number;
  orderBy?: string,
  orderType?: string
  search?: string,
}
