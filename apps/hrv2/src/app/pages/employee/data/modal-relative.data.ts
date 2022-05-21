import {RelativeEntity} from "../../../../../../../libs/employee-v2/src/lib/employee/entities/relative.entity";

export interface ModalRelative {
  employeeId: number
  update?: {
    relative: RelativeEntity,
  }
}
