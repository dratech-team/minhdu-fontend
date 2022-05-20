import {BaseCommodityTemplateEntity} from "../base/base-commodity-template.entity";
import {BaseUpdateDto} from "@minhdu-fontend/base-dto";

export interface BaseUpdateCommodityTemplateDto extends BaseCommodityTemplateEntity {
}

export type UpdateCommodityTemplateDto = BaseUpdateDto<BaseUpdateCommodityTemplateDto>
