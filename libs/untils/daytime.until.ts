export const getDaysInMonth = (datetime: Date) => {
  const month = new Date(datetime).getMonth() + 1;
  const year = new Date(datetime).getFullYear();
  return new Date(year, month, 0).getDate();
};
export const getFirstDayInMonth = (datetime: Date) => {
  return  new Date(datetime.getFullYear(), datetime.getMonth(), 1)
};

export const getLastDayInMonth = (datetime: Date) => {
  return new Date(datetime.getFullYear(), datetime.getMonth() + 1, 0)
};
