import { MigrateEnum } from '../enums/migrate.enum';

export interface SearchMigrateDto {
  readonly take: number;
  readonly skip: number;
  readonly product: string;
  readonly historyType: MigrateEnum;
}
