import {CategoryEntity} from "@minhdu-fontend/employee-v2";
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
