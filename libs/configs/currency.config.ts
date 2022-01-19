import { CurrencyMaskInputMode } from 'ngx-currency';

export const customCurrencyMaskConfig = {
  align: 'left',
  allowNegative: true,
  allowZero: true,
  decimal: ',',
  precision: 0,
  prefix: '',
  suffix: '',
  thousands: ',',
  nullable: true,
  inputMode: CurrencyMaskInputMode.FINANCIAL,
};

export const customCurrencyMaskConfig2 = Object.assign(
  {},
  customCurrencyMaskConfig,
  { suffix: ' đ' }
);
