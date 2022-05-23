import {RequireOnlyOne} from "../../../../../shared/types";
import {PositionEntity} from "@minhdu-fontend/orgchart-v2";

export interface ModalPositionData {
  add?: {
    position?: PositionEntity
  }
  update?: {
    position: PositionEntity
  }
}

export type DataAddOrUpdatePosition = RequireOnlyOne<ModalPositionData, 'add' | 'update'>
