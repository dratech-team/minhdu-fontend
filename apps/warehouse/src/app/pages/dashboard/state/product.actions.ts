import {createAction, props} from '@datorama/akita-ng-effects';
import {CreateProductDto} from '../dto/create-product.dto';
import {LoadProductDto} from '../dto/load-product.dto';
import {UpdateProductDto} from "../dto/update-product.dto";
import {Product} from "../entities/product.entity";

const addOne = createAction(
  '[PRODUCT] Add One',
  props<{ product: CreateProductDto }>()
);

const loadAll = createAction(
  '[PRODUCT] Load All',
  props< {params:LoadProductDto, isPagination?: boolean}>()
);

const getOne = createAction(
  '[PRODUCT] Get One',
  props<{ id: Product["id"] }>()
)

const update = createAction(
  '[PRODUCT] Update',
  props<{ id: Product["id"], body: UpdateProductDto }>()
);

const remove = createAction(
  '[PRODUCT] Delete',
  props<{ id: Product["id"] }>()
)

export const ProductActions = {addOne, loadAll, getOne, update, remove};
