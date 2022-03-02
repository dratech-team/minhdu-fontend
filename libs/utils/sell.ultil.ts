
export const getTotalCommodity = (commodities: any[]): number => {
  return commodities.reduce((total,commodity)=> total + commodity.amount, 0)
}
