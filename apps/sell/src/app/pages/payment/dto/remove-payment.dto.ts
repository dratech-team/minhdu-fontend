import {BaseRemoveDto} from "@minhdu-fontend/base-dto";

export type RemovePaymentDto = BaseRemoveDto & {customerId : number , paidTotal : number}
