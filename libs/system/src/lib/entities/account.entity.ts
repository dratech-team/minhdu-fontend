import {BaseAccountEntity} from "../base/base-account.entity";
import {App} from "@minhdu-fontend/enums";
import {BranchEntity} from "@minhdu-fontend/orgchart-v2";

export interface AccountEntity extends BaseAccountEntity{
  branches: BranchEntity[],
  role: Role,
}

interface Role {
  name: string,
  appName: App,
  role: string
}
