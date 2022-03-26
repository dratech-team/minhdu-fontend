import { ImportExportEnum } from '../enums/import-export.enum';

export interface SearchImportExportDto {
  readonly take: number;
  readonly skip: number;
  readonly product: string;
  readonly historyType: ImportExportEnum;
}
