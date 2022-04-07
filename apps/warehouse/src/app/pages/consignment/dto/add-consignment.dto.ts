import {BaseConsignmentEntity} from "../bases";
import {BaseAddDto} from "@minhdu-fontend/base-dto";

export interface BaseAddConsignmentDto extends Omit<BaseConsignmentEntity, 'id'> {
}

export type AddConsignmentDto = BaseAddDto<BaseAddConsignmentDto>
