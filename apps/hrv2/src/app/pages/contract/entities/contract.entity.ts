import { BaseContractEntity } from '../bases/base-contract.entity';
import { EmployeeEntity } from '@minhdu-fontend/employee-v2';

export interface ContractEntity extends BaseContractEntity {
  employee: EmployeeEntity;
}
