import {BaseContainerEntity} from "../bases";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";

export interface BaseSearchContainerDto extends BaseContainerEntity{
}

export type SearchContainerDto = BaseSearchDto<BaseSearchContainerDto>
