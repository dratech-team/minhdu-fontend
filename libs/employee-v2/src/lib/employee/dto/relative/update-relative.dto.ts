import {BaseUpdateDto} from "@minhdu-fontend/base-dto";
import {ConvertBoolean} from "@minhdu-fontend/enums";
import {BaseRelativeEntity} from "../../base/base-relative.entity";

export interface BaseUpdateRelativeDto extends Omit<BaseRelativeEntity, 'id'> {
  sos: ConvertBoolean
  wardId: number
}

export type UpdateRelativeDto = BaseUpdateDto<BaseUpdateRelativeDto>
