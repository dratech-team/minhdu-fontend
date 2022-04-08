import { BaseUpdateDto } from '@minhdu-fontend/base-dto';
import {BaseWarehouseEntity} from "../bases/base-warehouse.entity";

interface BaseUpdateCategoryDto extends BaseWarehouseEntity{

}

export type UpdateCategoryDto = BaseUpdateDto<BaseUpdateCategoryDto>
