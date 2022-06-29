import { Observer } from 'rxjs';
import { Employee } from '../data-models';

export const pickOne = (
  item: any,
  itemSelected: any[],
  items: any[],
  allowEmployeesSelected?: any[]
) => {
  const index = itemSelected.findIndex((val) => val.id === item.id);
  if (index > -1) {
    itemSelected.splice(index, 1);
    if (allowEmployeesSelected) {
      const indexAllowance = allowEmployeesSelected.findIndex(
        (emp) => emp.id === item.id
      );
      if (indexAllowance > -1) {
        allowEmployeesSelected.splice(indexAllowance, 1);
      }
    }
  } else {
    itemSelected.push(item);
  }
  const result = {
    isSelectAll:
      items.length > 0 &&
      items.every((val) => itemSelected.some((x) => x.id === val.id)),
    isSelectAllowance: false,
  };
  if (allowEmployeesSelected) {
    Object.assign(result, {
      isSelectAllowance:
        items.length > 0 &&
        items.every((val) =>
          allowEmployeesSelected.some((x) => x.id === val.id)
        ),
    });
  }
  return result;
};

export const pickAll = (
  select: boolean,
  items: any[],
  itemsSelected: any[],
  allowEmployeesSelected?: any[],
  isSelectAllowance?: boolean
): any => {
  items.forEach((val) => {
    if (select) {
      if (!itemsSelected.some((x) => x.id === val.id)) {
        itemsSelected.push(val);
      }
    } else {
      if (allowEmployeesSelected) {
        isSelectAllowance = false;
        const index = itemsSelected.findIndex((x) => x.id === val.id);
        const indexAllowance = allowEmployeesSelected.findIndex(
          (emp) => emp.id === val.id
        );
        if (index > -1) {
          itemsSelected.splice(index, 1);
          if (indexAllowance > -1) {
            allowEmployeesSelected.splice(indexAllowance, 1);
          }
        }
      } else {
        const index = itemsSelected.findIndex((x) => x.id === val.id);
        if (index > -1) {
          itemsSelected.splice(index, 1);
        }
      }
    }
  });

  return isSelectAllowance;
};

export const someComplete = (
  items: any[],
  itemsSelected: any[],
  isSelectAll: boolean
): boolean => {
  if (items.length === 0) {
    return false;
  } else {
    return (
      items.filter((val) => itemsSelected.some((x) => x.id === val.id)).length >
        0 && !isSelectAll
    );
  }
};

export const checkIsSelectAllInit = (itemSub: any[], itemsSelected: any[]) => {
  return (
    itemSub.every((item) => itemsSelected.some((x) => x.id === item.id)) &&
    itemSub.length > 0 &&
    itemsSelected.length > 0
  );
};

export const handleValSubPickItems = (
  valSub: any[],
  items: any[],
  itemSelected: any[],
  isSelectAll: boolean
) => {
  valSub.forEach((val) => {
    if (isSelectAll) {
      if (!itemSelected.some((x) => x.id === val.id)) {
        itemSelected.push(val);
      }
    }
  });
  return JSON.parse(JSON.stringify(valSub));
};
