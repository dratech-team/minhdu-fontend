
import { CommodityUnit } from '@minhdu-fontend/enums';
import { Order } from '../../../order/container/+state/order.interface';



export interface Commodity{
  id : number
  code: string
  name : string
  unit: CommodityUnit,
  price : number
  amount :number
  orders :Order[]
  isSelect: boolean;
}
