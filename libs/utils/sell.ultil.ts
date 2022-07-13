export const getTotalPriceOfCommodity = (commodities: any[]): number => {
  return commodities.reduce((total, commodity) => total + commodity.price, 0);
};
