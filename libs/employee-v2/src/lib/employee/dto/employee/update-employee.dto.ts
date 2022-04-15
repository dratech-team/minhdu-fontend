import {BaseEmployeeEntity} from "../../base";
import {BaseAddDto, BaseUpdateDto} from "@minhdu-fontend/base-dto";

export interface BaseUpdateEmployeeDto extends BaseEmployeeEntity {

}

export type UpdateEmployeeDto = BaseUpdateDto<BaseUpdateEmployeeDto>
