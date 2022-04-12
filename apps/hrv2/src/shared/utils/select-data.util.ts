export const refreshCheckedStatusUtil = (listOfCurrentPageData: any[], setOfCheckedData: Set<any>, checked: boolean) => {
  const check = listOfCurrentPageData.every((item) => setOfCheckedData.has(item));
  const indeterminate = listOfCurrentPageData.some(({item}) => setOfCheckedData.has(item)) && checked;
  return {
    check,
    indeterminate
  }
}

export const updateCheckedSetUtil = (item: any, checked: boolean, setOfCheckedData: Set<any>) => {
  if (checked) {
    setOfCheckedData.add(item);
  } else {
    setOfCheckedData.delete(item);
  }
  return setOfCheckedData
}
