
export const updateStateUiUtil = <T>(newState: Partial<T>, type: 'visible' | 'pinned') => {
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
