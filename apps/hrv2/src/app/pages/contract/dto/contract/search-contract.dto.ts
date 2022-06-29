import { BaseSearchDto } from '@minhdu-fontend/base-dto';
import { BaseContractEntity } from '../../bases/base-contract.entity';

export type BaseSearchContractDto = BaseContractEntity;

export type SearchContractDto = BaseSearchDto<BaseSearchContractDto>;
