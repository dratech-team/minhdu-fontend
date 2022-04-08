import {BaseAddDto} from "@minhdu-fontend/base-dto";
import {BaseProductEntity} from "../bases";

export interface BaseAddProductDto extends Omit<BaseProductEntity,'id'>  {
  readonly categoryId: number
  readonly supplierId: number,
  readonly branchIds?: number[],
  readonly amount?:number
}

export type AddProductDto = BaseAddDto<BaseAddProductDto>
