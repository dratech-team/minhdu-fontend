import {BaseCommodityTemplateEntity} from "../base/base-commodity-template.entity";
import {BaseAddDto} from "@minhdu-fontend/base-dto";

export interface BaseAddCommodityTemplateDto extends BaseCommodityTemplateEntity {
}

export type AddCommodityTemplateDto = BaseAddDto<BaseAddCommodityTemplateDto>
