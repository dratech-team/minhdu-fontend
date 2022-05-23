import {BaseAccountEntity} from "../../base/base-account.entity";
import {BaseUpdateDto} from "@minhdu-fontend/base-dto";

export interface BaseUpdateSystemHistory extends BaseAccountEntity{
}

export type UpdateSystemHistoryDto = BaseUpdateDto<BaseUpdateSystemHistory>
