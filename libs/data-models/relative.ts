import { RelationshipEnum } from '../enums';
import { Profile } from './profile/profile';
export interface Relative{
  id:number;
  employeeId: number,
  sos: boolean;
  relationship?: RelationshipEnum,
  career?: string,
  profile: Profile;
}
