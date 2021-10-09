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
