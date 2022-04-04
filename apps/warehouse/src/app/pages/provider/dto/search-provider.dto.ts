import { BaseSearchDto } from '@minhdu-fontend/base-dto';
import { ProviderEntity } from '../entities';

export interface SearchProviderDto extends BaseSearchDto<ProviderEntity> {
  take?: number,
  skip?: number,
}
