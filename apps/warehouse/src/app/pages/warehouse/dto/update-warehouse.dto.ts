import { BaseUpdateDto } from '@minhdu-fontend/base-dto';
import {BaseWarehouseEntity} from "../bases/base-warehouse.entity";

interface BaseUpdateWarehouseDto extends BaseWarehouseEntity{

}

export type UpdateWarehouseDto = BaseUpdateDto<BaseUpdateWarehouseDto>
