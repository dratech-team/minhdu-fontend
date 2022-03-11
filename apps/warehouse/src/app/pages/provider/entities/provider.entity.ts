export interface ProviderEntity {
  readonly id: number;
  readonly name: string;
  readonly code?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly debt?: number;
  readonly total?: number;
}
