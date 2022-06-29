import { BaseAddDto } from '@minhdu-fontend/base-dto';
import { BaseRelativeEntity } from '../../base/base-relative.entity';
import { ConvertBoolean } from '@minhdu-fontend/enums';

export interface BaseAddRelativeDto extends Omit<BaseRelativeEntity, 'id'> {
  sos: ConvertBoolean;
  wardId: number;
}

export type AddRelativeDto = BaseAddDto<BaseAddRelativeDto>;
