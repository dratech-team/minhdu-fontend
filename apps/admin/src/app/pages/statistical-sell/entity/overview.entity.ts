interface Rate {
  rate: number;
  total: number;
  link: string;
}

export interface OverviewSell {
  datetime: Date;
  order: {
    rate: number;
    total: number;
    link: string;
    income: Rate;
  };
  customer: {
    potential: number;
    total: number;
    link: string;
  };
}
