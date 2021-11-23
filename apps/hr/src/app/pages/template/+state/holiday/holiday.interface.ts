import { Position } from '@minhdu-fontend/data-models';

export interface Holiday {
  id: number,
  name: string,
  datetime: Date,
  rate: number,
  positions: Position[]
  note?: string,
  isConstraint?: boolean,
  price?: number
}

export interface HolidayDTO {
  take?: number,
  skip?: number,
  name?: string,
  datetime?: Date,
  department?: string,
  rate?: number,
}
