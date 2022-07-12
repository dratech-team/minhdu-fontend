import { Profile } from '../index';
import { RelationshipEnum } from '../../enums';
export interface Relative {
  firstName: string;
  lastName: string;
  id: number;
  employeeId: number;
  sos: boolean;
  relationship?: RelationshipEnum;
  career?: string;
  profile: Profile;
  email?: string;
  phone?: string;
  workPhone?: string;
  birthday: Date;
}
