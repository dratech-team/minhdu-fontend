import {BaseAddDto} from '@minhdu-fontend/base-dto';
import {BaseWarehouseEntity} from "../bases/base-warehouse.entity";

interface BaseAddCategory extends BaseWarehouseEntity{

}

export type AddCategoryDto = BaseAddDto<BaseAddCategory>
