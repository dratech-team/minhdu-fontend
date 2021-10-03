export const getDaysInMonth = (datetime: Date) => {
  const month = new Date(datetime).getMonth() + 1;
  const year = new Date(datetime).getFullYear();
  return new Date(year, month, 0).getDate();
};
