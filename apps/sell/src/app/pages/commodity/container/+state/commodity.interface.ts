import { Order } from '@minhdu-fontend/data-models';
import { CommodityUnit } from '@minhdu-fontend/enums';



export interface Commodity{
  id : number
  code: string
  name : string
  unit: CommodityUnit,
  price : number
  amount :number
  orders :Order[]
}
