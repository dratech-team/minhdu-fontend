import { AccountEntity } from '../entities/account.entity';

export interface ModalRegisterData {
  update: {
    account: AccountEntity;
  };
}
