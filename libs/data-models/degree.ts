import { FormalityEnum } from '../enums/formality.enum';
import { DegreeLevelEnum } from '../enums/degree-level.enum';
import { DegreeStatusEnum } from '../enums/degree-status.enum';
import { DegreeTypeEnum } from '../enums/degree-type.enum';

export interface Degree{
  employeeId: number,
  name: string,
  school: string,
  type: DegreeTypeEnum,
  id: number,
  startedAt: Date,
  endedAt: Date,
  major: string,
  formality: FormalityEnum,
  level: DegreeLevelEnum,
  status: DegreeStatusEnum,
  note?: string,
}
