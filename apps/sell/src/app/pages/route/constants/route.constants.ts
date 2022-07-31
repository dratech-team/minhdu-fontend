import { VisibleExtendEntity } from '@minhdu-fontend/data-models';
import { DataTypeEnum } from '@minhdu-fontend/enums';

const listUI: VisibleExtendEntity[] = [
  {
    key: ['status'],
    title: 'Trạng thái chuyến xe',
    dataType: DataTypeEnum.STRING,
    textColor: '#32863d',
    width: null,
    pinned: false,
    visible: true
  },
  {
    key: ['name'],
    title: 'Tên tuyến đường',
    dataType: DataTypeEnum.STRING,
    width: null,
    textColor: null,
    pinned: false,
    visible: true
  },
  {
    key: ['startedAt'],
    title: 'Ngày bắt đầu',
    dataType: DataTypeEnum.DATE,
    width: null,
    textColor: null,
    pinned: false,
    visible: true
  },
  {
    key: ['endedAt'],
    title: 'Ngày kết thúc',
    dataType: DataTypeEnum.DATE,
    width: null,
    textColor: null,
    pinned: false,
    visible: true
  },
  {
    key: ['driver'],
    title: 'Tên tài xế',
    dataType: DataTypeEnum.STRING,
    width: null,
    textColor: null,
    pinned: false,
    visible: true
  },
  {
    key: ['bsx'],
    title: 'Biển số xe',
    dataType: DataTypeEnum.STRING,
    width: null,
    textColor: null,
    pinned: false,
    visible: true
  },
  {
    key: ['garage'],
    title: 'Nhà xe',
    dataType: DataTypeEnum.STRING,
    width: null,
    textColor: null,
    pinned: false,
    visible: true
  }
];

export const RouteConstant = { listUI };
