import { createAction, props } from '@datorama/akita-ng-effects';
import { AddSupplierDto, SearchSupplierDto, UpdateSupplierDto } from '../dto';
import { RemoveSupplierDto } from '../dto/remove-supplier.dto';

const addOne = createAction('[SUPPLIER] Add One', props<AddSupplierDto>());

const loadAll = createAction('[SUPPLIER] Load All', props<SearchSupplierDto>());

const update = createAction('[SUPPLIER] Update ', props<UpdateSupplierDto>());

const remove = createAction('[SUPPLIER] Remove ', props<RemoveSupplierDto>());

const error = createAction('[SUPPLIER] Error ', props<{ error: string }>());

export const SupplierActions = { addOne, loadAll, update, remove, error };
