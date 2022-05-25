import {BasePositionEntity} from "../bases";
import {BranchEntity} from "../../branch/entities/branch.entity";

export interface PositionEntity extends BasePositionEntity{
  branches: BranchEntity[]
  _count?: any
}
