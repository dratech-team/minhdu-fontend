export const getBeforeTime = (time: number): number[] => {
  const result: number[] = [];
  for (let i = 0; i < time; i++) {
    result.push(i);
  }
  return result;
};

export const getAfterTime = (
  time: number,
  type: 'HOUR' | 'MINUTE'
): number[] => {
  const result: number[] = [];
  for (let i = time + 1; i <= (type === 'HOUR' ? 24 : 60); i++) {
    result.push(i);
  }
  return result;
};
