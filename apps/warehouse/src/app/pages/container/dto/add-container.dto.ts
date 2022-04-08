import {BaseAddDto} from "@minhdu-fontend/base-dto";
import {BaseContainerEntity} from "../bases";

export interface BaseAddContainerDto extends BaseContainerEntity  {
}

export type AddContainerDto = BaseAddDto<BaseAddContainerDto>
