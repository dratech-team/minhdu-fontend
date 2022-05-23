import {BasePositionEntity} from "../bases";
import {Branch} from "@minhdu-fontend/data-models";

export interface PositionEntity extends BasePositionEntity{
  branches: Branch[]
  _count?: any
}
