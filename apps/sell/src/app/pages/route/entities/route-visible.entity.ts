import { VisibleEntity } from '@minhdu-fontend/data-models';

export interface RouteVisibleEntity {
  readonly stt: VisibleEntity;
  readonly name: VisibleEntity;
  readonly startedAt: VisibleEntity;
  readonly endedAt: VisibleEntity;
  readonly driver: VisibleEntity;
  readonly bsx: VisibleEntity;
  readonly garage: VisibleEntity;
  readonly status: VisibleEntity;
}
