 import { Social } from '../../../../../../../../libs/data-models/Social.interface';
 import { Degree } from '../../../../../../../../libs/data-models/degree.interface';
 import { WorkHistory } from '../../../../../../../../libs/data-models/work-history.interface';
 import { Relative } from '../../../../../../../../libs/data-models/relative.interface';
 import { Position } from '../../../../../../../../libs/data-models/orgChart.interface/position.interface';
 import { Profile } from '../../../../../../../../libs/data-models/human/profile.interface';

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

