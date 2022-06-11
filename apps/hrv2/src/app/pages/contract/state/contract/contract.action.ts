import {createAction, props} from '@datorama/akita-ng-effects';
import {AddContractDto} from "../../dto/contract/add-contract.dto";
import {SearchContractDto} from "../../dto/contract/search-contract.dto";
import {LoadOneContractDto} from "../../dto/contract/load-one-contract.dto";
import {UpdateContractDto} from "../../dto/contract/update-contract.dto";
import {RemoveContractDto} from "../../dto/contract/remove-contract.dto";


const addOne = createAction(
  '[CONTRACT] Add One',
  props<AddContractDto>()
);

//Chưa sử dụng, sử dụng khi tạo module quản lý hợp đồng nhân viên
const loadAll = createAction(
  '[CONTRACT] Load All',
  props<SearchContractDto>()
);

//Chưa sử dụng, sử dụng khi tạo module quản lý hợp đồng nhân viên
const loadOne = createAction(
  '[CONTRACT] Load One',
  props<LoadOneContractDto>()
);

const update = createAction(
  '[CONTRACT] Update',
  props<UpdateContractDto>()
);


const remove = createAction(
  '[CONTRACT] Remove',
  props<RemoveContractDto>()
);

const error = createAction(
  '[RANK] Error',
  props<{ error: string }>()
);

export const ContractActions = {
  addOne,
  loadAll,
  loadOne,
  update,
  remove,
  error,
};
