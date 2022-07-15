/*
* Phiên bản cũ chưa được refactor
* */

export interface VisibleEntity {
  readonly pinned: boolean;
  readonly visible: boolean;
}

/*
* Code mới. Sử dụng cho việc load ui từ listUI đồng bộ với popup ghim/hiển thị
* */
export interface VisibleExtendEntity extends VisibleEntity {
  readonly key: Array<string>;
  readonly title: string;
  readonly width: number | null;
  readonly textColor: string | null;
}
