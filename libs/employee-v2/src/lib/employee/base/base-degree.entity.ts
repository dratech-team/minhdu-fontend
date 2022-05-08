import {BaseEntity} from "@minhdu-fontend/base-entity";
import {DegreeLevelEnum, DegreeStatusEnum, DegreeTypeEnum, FormalityEnum} from "@minhdu-fontend/enums";

export interface BaseDegreeEntity extends BaseEntity{
  name: string,
  school: string,
  type: DegreeTypeEnum,
  startedAt: Date,
  endedAt: Date,
  major: string,
  formality: FormalityEnum,
  level: DegreeLevelEnum,
  status: DegreeStatusEnum,
  note?: string,
}
