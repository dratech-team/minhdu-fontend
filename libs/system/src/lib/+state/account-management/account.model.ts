import { Branch } from '@minhdu-fontend/data-models';

import { App } from '@minhdu-fontend/enums';

export interface Account {
  id: number,
  username: string,
  branches: Branch[],
  role: Role,
  loggedAt: Date,
  ip: string,
  timestamp: Date,
  createdAt: Date
}

interface Role {
  name: string,
  appName: App,
  role: string
}

export interface AccountDTO extends Partial<Account> {
  take?: number,
  skip?: number,
}
