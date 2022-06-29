export const checkInputNumber = (event: any) => {
  return event.charCode === 8 || event.charCode === 0
    ? null
    : event.charCode >= 48 && event.charCode <= 57;
};
