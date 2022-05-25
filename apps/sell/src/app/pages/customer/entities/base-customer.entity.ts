import { CustomerResource, CustomerType, Gender } from '@minhdu-fontend/enums';
import { BaseEntity } from '@minhdu-fontend/base-entity';

export interface BaseCustomerEntity extends BaseEntity {
  readonly lastName: string;
  readonly avt?: string;
  readonly phone: string;
  readonly workPhone?: string;
  readonly address?: string;
  readonly email?: string;
  readonly zalo?: string;
  readonly facebook?: string;
  readonly religion?: string;
  readonly birthplace?: string;
  readonly birthday?: Date;
  readonly ethnicity?: string;
  readonly identify?: string;
  readonly idCardAt?: Date;
  readonly issuedBy?: string;
  readonly mst?: string;
  readonly type?: CustomerType;
  readonly resource?: CustomerResource;
  readonly gender?: Gender
  readonly  isPotential?: boolean;
  readonly  note?: string;
  readonly  debt?: number;
}
