import {BaseAccountEntity} from "../base/base-account.entity";
import {App} from "@minhdu-fontend/enums";
import {BranchEntity} from "@minhdu-fontend/orgchart-v2";

export interface AccountEntity extends BaseAccountEntity{
  branches: BranchEntity[],
  role: Role,
  mode: string /* đã toạ ModeEnum ở nhánh config mode*/
  token: string
}

interface Role {
  name: string,
  appName: App,
  role: string
}
