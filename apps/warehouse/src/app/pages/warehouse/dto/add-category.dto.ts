import {BaseAddDto} from '../../../../../../../libs/dto';
import {BaseCategoryEntity} from "../bases/base-category.entity";

interface BaseAddCategory extends BaseCategoryEntity{

}

export type AddCategoryDto = BaseAddDto<BaseAddCategory>
