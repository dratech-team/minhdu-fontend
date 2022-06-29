import {
  ConvertBoolean,
  Gender,
  RelationshipEnum,
} from '@minhdu-fontend/enums';
import { Profile, Ward } from '@minhdu-fontend/data-models';
import { BaseEntity } from '@minhdu-fontend/base-entity';

export interface BaseRelativeEntity extends BaseEntity {
  lastName: string;
  relationship?: RelationshipEnum;
  career?: string;
  phone?: string;
  workPhone?: string;
  birthday: Date;
  issuedBy?: string;
  religion?: string;
  ethnicity?: string;
  birthplace?: string;
  address?: string;
  identify?: string;
  idCardAt?: Date;
  gender?: Gender;
  note?: string;
  email?: string;
  employeeId: number;
}
