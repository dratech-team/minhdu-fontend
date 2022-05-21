import {BaseRelativeEntity} from "../base/base-relative.entity";
import {District, Province, Ward} from "@minhdu-fontend/data-models";

export interface RelativeEntity extends BaseRelativeEntity{
  sos: boolean;
  ward: Ward
}
