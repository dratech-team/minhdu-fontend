import {CancelEnum} from "../enums/cancel.enum";

export interface CancelDto {
  readonly desId: number,
  readonly cancelType: CancelEnum
}
