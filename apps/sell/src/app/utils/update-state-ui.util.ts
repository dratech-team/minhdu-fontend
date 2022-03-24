import {CustomerVisibleEntity} from "../pages/customer/entities/customer-visible.entity";

export const UpdateStateUiUtil = (newState: Partial<CustomerVisibleEntity>, type: 'visible' | 'pinned') => {
  const newStateClone = JSON.parse(JSON.stringify(newState))
  switch (type) {
    case 'visible':
      newStateClone[Object.keys(newState).toString()].visible = !newStateClone[Object.keys(newState).toString()].visible
      break;
    case "pinned":
      newStateClone[Object.keys(newState).toString()].pinned = !newStateClone[Object.keys(newState).toString()].pinned
      break;
  }
  return newStateClone
}
