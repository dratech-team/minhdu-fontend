import { BaseContractEntity } from '../../bases/base-contract.entity';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';

export type BaseUpdateContractDto = BaseContractEntity;

export type UpdateContractDto = BaseUpdateDto<BaseUpdateContractDto>;
