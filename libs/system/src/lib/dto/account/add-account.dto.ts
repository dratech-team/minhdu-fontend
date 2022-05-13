import {BaseAddDto} from "../../../../../dto";
import {App} from "@minhdu-fontend/enums";

export interface BaseAddAccountDto {
  username: string,
  password: string,
  branchIds: number [],
  roleId: number,
  appName: App,
}
export type AddAccountDto = BaseAddDto<BaseAddAccountDto>
