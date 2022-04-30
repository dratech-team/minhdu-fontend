import {CategoryEntity} from "../../../../../../../libs/employee-v2/src/lib/employee/entities/category.entity";
import {RequireOnlyOne} from "../../../../shared/types";

export interface ModalCategoryData {
  add?: {
    category?: CategoryEntity
  }
  update?: {
    category: CategoryEntity
  }
}

export type DataAddOrUpdateCategory = RequireOnlyOne<ModalCategoryData, 'add' | 'update'>
