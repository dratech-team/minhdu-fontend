import { BaseEntity } from '@minhdu-fontend/base-entity';
import { Gender } from '@minhdu-fontend/enums';

export interface BaseEmployeeEntity extends BaseEntity {
  code: string,
  gender: Gender,
  phone?: string,
  identify?: string,
  address: string,
  note?: string;
}

