import {BaseAccountEntity} from "../base/base-account.entity";
import {Role} from "@minhdu-fontend/enums";
import {BranchEntity} from "@minhdu-fontend/orgchart-v2";

export interface AccountEntity extends BaseAccountEntity {
  branches: BranchEntity[],
  role: Role,
  token: string,
  mode: string/* có tạo modeEnum ở nhánh config mode mergh hai nhánh sẽ thay tránh conflit*/
}
