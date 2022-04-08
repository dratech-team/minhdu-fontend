import {BaseContainerEntity} from "../bases";
import {BaseUpdateDto} from "@minhdu-fontend/base-dto";

interface BaseUpdateContainerDto extends BaseContainerEntity{
}

export type UpdateContainerDto = BaseUpdateDto<BaseUpdateContainerDto>
