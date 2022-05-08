import {RelationshipEnum} from "@minhdu-fontend/enums";
import {Profile} from "@minhdu-fontend/data-models";
import {BaseEntity} from "@minhdu-fontend/base-entity";

export interface BaseRelativeEntity extends BaseEntity{
  firstName: string,
  lastName: string,
  sos: boolean;
  relationship?: RelationshipEnum,
  career?: string,
  profile: Profile;
  email?: string,
  phone?: string,
  workPhone?: string,
  birthday: Date,
}
