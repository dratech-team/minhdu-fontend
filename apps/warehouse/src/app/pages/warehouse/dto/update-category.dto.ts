import { BaseUpdateDto } from '../../../../../../../libs/dto';
import { CategoryEntity } from '../entities';
import {BaseCategoryEntity} from "../bases/base-category.entity";
interface BaseUpdateCategoryDto extends BaseCategoryEntity{

}

export type UpdateCategoryDto = BaseUpdateDto<BaseUpdateCategoryDto>
