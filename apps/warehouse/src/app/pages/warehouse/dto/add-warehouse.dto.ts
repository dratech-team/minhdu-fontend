import { BaseAddDto } from '../../../../../../../libs/dto';
import { WarehouseEntity } from '../entities';

export interface AddWarehouseDto extends BaseAddDto<Omit<WarehouseEntity, 'id'>> {
}
