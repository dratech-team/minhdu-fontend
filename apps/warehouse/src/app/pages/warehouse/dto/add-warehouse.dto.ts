import {BaseAddDto} from '@minhdu-fontend/base-dto';
import {BaseWarehouseEntity} from "../bases/base-warehouse.entity";

interface BaseAddWarehouse extends BaseWarehouseEntity{

}

export type AddWarehouseDto = BaseAddDto<BaseAddWarehouse>
