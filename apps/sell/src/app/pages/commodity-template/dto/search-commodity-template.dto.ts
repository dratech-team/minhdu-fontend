import { BaseSearchDto } from '@minhdu-fontend/base-dto';
import { CommodityTemplateEntity } from '../entities';
export interface BaseSearchCommodityTemplateDto
  extends CommodityTemplateEntity {}

export type SearchCommodityTemplateDto =
  BaseSearchDto<BaseSearchCommodityTemplateDto>;
