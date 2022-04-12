export const refreshCheckedStatusUtil = (listOfCurrentPageData: any[], setOfCheckedId: Set<number>, checked: boolean) => {
  const check = listOfCurrentPageData.every(({id}) => setOfCheckedId.has(id));
  const indeterminate = listOfCurrentPageData.some(({id}) => setOfCheckedId.has(id)) && checked;
  return {
    check,
    indeterminate
  }
}

export const updateCheckedSetUtil = (id: number, checked: boolean, setOfCheckedId: Set<number>) => {
  if (checked) {
    setOfCheckedId.add(id);
  } else {
    setOfCheckedId.delete(id);
  }
  return setOfCheckedId
}
