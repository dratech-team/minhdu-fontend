import {BaseEmployeeEntity} from "../../base";
import {BaseAddDto, BaseUpdateDto} from "@minhdu-fontend/base-dto";
import {BaseRelativeDto} from "./add-relative.dto";

export interface BaseUpdateRelativeDto extends BaseRelativeDto {

}

export type UpdateRelativeDto = BaseUpdateDto<BaseUpdateRelativeDto>
