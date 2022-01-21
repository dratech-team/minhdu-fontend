interface Rate {
  rate: number;
  total: number;
}

export interface OverviewSell {
  datetime: Date;
  order: {
    rate: number;
    total: number;
    income: Rate;
  };
  customer: {
    potential: number;
    total: number;
  }
}
