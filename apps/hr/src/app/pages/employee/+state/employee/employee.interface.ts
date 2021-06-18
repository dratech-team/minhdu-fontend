import { Gender } from '../../../../../../../../libs/enums/gender.enum';
import { RelationshipEnum } from '../../../../../../../../libs/enums/relationship.enum';
import { EntityState } from '@ngrx/entity';

export interface Employee {
  id: number;
  name?: string;
  avt?: string;
  address?: string;
  identify?: string;
  idCardAt?: Date;
  birthday?: Date;
  gender?: Gender;
  isFlatSalary?: boolean;
  price?: number;
  workedAt?: Date;
  leftAt?: Date;
  stayedAt?: Date | null;
  contractAt?: Date | null;
  branchId?: number;
  branch?: any;
  departmentId?: number;
  department?: any;
  positionId?: number;
  position?: any;
  qrcode?: string;
  note?: string;
  createdAt?: Date | null;
  religion?: string,
  ethnic?: string,
  issuedBy?: string,

  //Degree
  certificate?: string;
  startedAt?: Date,
  endedAt?: Date,
  major?: string,
  formality?: string,
  level?: string,
  status?: string,
  trainingBy?: Date,

  //contact info
  zalo?: string;
  phone?: string;
  email?:string,
  birthplace?: string;
  facebook?:string;
  family: Relative[],

  //contact sos
  nameSOS?:string,
  phoneSOS?: number,
  emailSOS?:null,
  addressSOS?:string,
  relationshipSOS?: string,
}
export interface Relative{
  id:number,
  relationship?: RelationshipEnum,
  name?: string,
  birthday?: Date,
  gender?:Gender,
  identify?:string,
  address?: string,
  phone?:string,
  email?:string,
  career?: string,
  employeeId: number,
}
