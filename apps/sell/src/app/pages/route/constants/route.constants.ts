import { VisibleExtendEntity } from '@minhdu-fontend/data-models';

const listUI: VisibleExtendEntity[] = [
  {
    key: ['status'],
    title: 'Trạng thái chuyến xe',
    textColor: '#32863d',
    width: null,
    pinned: false,
    visible: true
  },
  {
    key: ['name'],
    title: 'Tên tuyến đường',
    width: null,
    textColor: null,
    pinned: false,
    visible: true
  },
  {
    key: ['startedAt'],
    title: 'Ngày bắt đầu',
    width: null,
    textColor: null,
    pinned: false,
    visible: true
  },
  {
    key: ['endedAt'],
    title: 'Ngày kết thúc',
    width: null,
    textColor: null,
    pinned: false,
    visible: true
  },
  {
    key: ['driver'],
    title: 'Tên tài xế',
    width: null,
    textColor: null,
    pinned: false,
    visible: true
  },
  {
    key: ['bsx'],
    title: 'Biển số xe',
    width: null,
    textColor: null,
    pinned: false,
    visible: true
  },
  {
    key: ['garage'],
    title: 'Nhà xe',
    width: null,
    textColor: null,
    pinned: false,
    visible: true
  }
];

export const RouteConstant = { listUI };
