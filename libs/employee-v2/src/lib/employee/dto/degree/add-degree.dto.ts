import { BaseAddDto } from '@minhdu-fontend/base-dto';
import { DegreeEntity } from '../../entities/degree.entity';

export interface BaseAddDegreeDto extends Omit<DegreeEntity, 'id'> {
  employeeId: number;
}

export type AddDegreeDto = BaseAddDto<BaseAddDegreeDto>;
