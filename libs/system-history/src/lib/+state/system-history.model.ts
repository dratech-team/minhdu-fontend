import { ActivityType, App } from '@minhdu-fontend/enums';


export interface SystemHistory {
  id: number,
  appName: App,
  name: string,
  activity: ActivityType
  description: string,
  ip: string,
  createdAt?: Date,
}
