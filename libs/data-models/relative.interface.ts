import { RelationshipEnum } from '../enums/relationship.enum';
import { Profile } from './human/profile.interface';
export interface Relative{
  id:number;
  employeeId: number,
  sos: boolean;
  relationship?: RelationshipEnum,
  career?: string,
  profile:Profile
}
