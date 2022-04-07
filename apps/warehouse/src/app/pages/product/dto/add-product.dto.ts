import {BaseProductEntity} from "../bases";
import {BaseAddDto} from "@minhdu-fontend/base-dto";

export interface BaseAddProductDto extends Omit<BaseProductEntity,'id'>  {
  readonly categoryId: number
  readonly supplierId: number,
  readonly branchIds?: number[],
  readonly amount?:number
}

export type AddProductDto = BaseAddDto<BaseAddProductDto>
