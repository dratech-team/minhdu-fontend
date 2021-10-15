import { Branch } from '@minhdu-fontend/data-models';
import { Role } from '../../../../../enums/hr/role.enum';

export interface Account {
  id: number,
  username: string,
  branch: Branch,
  role: Role,
  loggedAt: Date,
  ip: string,
  timestamp: Date,
  createdAt: Date
}

export interface AccountDTO extends Partial<Account> {
  take?: number,
  skip?: number,
}
