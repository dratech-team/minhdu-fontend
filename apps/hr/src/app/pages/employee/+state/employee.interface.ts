 import {
    Degree,
   Position,
   Profile,
   Relative,
   Social,
   WorkHistory
} from '@minhdu-fontend/data-models';

export interface Employee{
  id: number,
  workedAt: Date;
  code: string,
  issuedBy?: string,
  isFlatSalary: boolean,
  position: Position,
  note?: string;
  social?: Social,
  degrees?: Degree[],
  WorkHistories?: WorkHistory,
  relatives : Relative[],
  profile: Profile,
  bhyt?: string,
}

