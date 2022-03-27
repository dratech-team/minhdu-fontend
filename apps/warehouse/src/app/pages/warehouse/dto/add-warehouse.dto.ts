import { BaseAddDto } from '../../../../shared/dto';
import { WarehouseEntity } from '../entities';

export interface AddWarehouseDto extends BaseAddDto<Omit<WarehouseEntity, 'id'>> {
}
