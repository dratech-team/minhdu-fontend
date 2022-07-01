export interface ContextMenuEntity {
  readonly title: string;
  readonly click: Function | null;
  readonly submenu?: { title: string; click: Function }[];
}
