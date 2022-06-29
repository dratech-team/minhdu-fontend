import { BaseContractEntity } from '../../bases/base-contract.entity';
import { BaseAddDto } from '@minhdu-fontend/base-dto';

export type BaseAddContract = BaseContractEntity;

export type AddContractDto = BaseAddDto<BaseAddContract>;
