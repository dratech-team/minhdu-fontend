export interface ContextMenuEntity {
  readonly title: string;
  readonly click: Function;
  readonly submenu?: { title: string; click: Function }[];
}
