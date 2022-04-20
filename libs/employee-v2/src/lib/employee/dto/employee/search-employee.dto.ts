import {BaseEmployeeEntity} from "../../base";
import {BaseAddDto, BaseSearchDto} from "@minhdu-fontend/base-dto";

export interface BaseSearchEmployeeDto extends BaseEmployeeEntity {

}

export type SearchEmployeeDto = BaseSearchDto<BaseSearchEmployeeDto>
