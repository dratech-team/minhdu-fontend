import {BaseDepartmentEntity} from "../bases";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";

export interface BaseSearchDepartmenthDto extends BaseDepartmentEntity {
}

export type SearchDepartmentDto = BaseSearchDto<BaseSearchDepartmenthDto>
