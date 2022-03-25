import {createAction, props} from '@datorama/akita-ng-effects';
import {CreateProductDto} from '../dto/create-product.dto';
import {LoadProductDto} from '../dto/load-product.dto';
import {UpdateProductDto} from "../dto/update-product.dto";
import {Product} from "../entities/product.entity";

const addOne = createAction(
  '[WAREHOUSE/PRODUCT] Add One',
  props<{ product: CreateProductDto }>()
);

const loadAll = createAction(
  '[WAREHOUSE/PRODUCT] Load All',
  props< {params:LoadProductDto, isPagination?: boolean}>()
);

const getOne = createAction(
  '[WAREHOUSE/PRODUCT] Get One',
  props<{ id: Product["id"] }>()
)

const update = createAction(
  '[WAREHOUSE/PRODUCT] Update',
  props<{ id: Product["id"], body: UpdateProductDto }>()
);

const remove = createAction(
  '[WAREHOUSE/PRODUCT] Delete',
  props<{ id: Product["id"] }>()
)

export const ProductActions = {addOne, loadAll, getOne, update, remove};
