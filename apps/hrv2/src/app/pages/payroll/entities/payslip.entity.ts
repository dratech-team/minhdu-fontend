import {BaseEntity} from "@minhdu-fontend/base-entity";

export interface PayslipEntity extends BaseEntity {
  readonly basicSalary: number
  readonly staySalary: number
  readonly allowanceSalary: number
  readonly overtimeSalary: {
    duration:{
      day: number,
      hour: number,
      minute: number
    },
    total: number
  }
  readonly deductionSalary: number
  readonly absent: {
    duration:{
      paidLeave: number,
      unPaidLeave: number
    },
    total: number
  }
  readonly holiday:{
    working: {duration: number; total: number}
    unWorking: {duration: number; total: number}
  }
  readonly workDay: {duration: number; total: number}
  readonly tax: number,
  readonly total: number
}
