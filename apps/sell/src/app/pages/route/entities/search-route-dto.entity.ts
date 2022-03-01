export interface SearchRouteDto {
  readonly take?: number;
  readonly skip?: number;
  readonly orderId?: number;
  readonly name?: string;
  readonly startedAt?: Date;
  readonly endedAt?: Date;
  readonly driver?: string;
  readonly bsx?: string;
  readonly garage?: string;
}
