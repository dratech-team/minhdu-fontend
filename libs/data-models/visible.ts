export interface VisibleEntity {
  readonly key?: string;
  readonly pinned: boolean;
  readonly visible: boolean;
  readonly title?: string;
  readonly width?: number | null;
  readonly textColor?: string;
}
