import { DegreeLevelEnum, DegreeStatusEnum, DegreeTypeEnum, FormalityEnum } from '../enums';

export interface Degree {
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
