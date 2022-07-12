import { RateConditionEntity } from '../entities/rate-condition.entity';

export interface ModalRateConditionData {
  update?: {
    rateCondition: RateConditionEntity;
  };
}
