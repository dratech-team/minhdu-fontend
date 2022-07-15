import { VisibleEntity } from '@minhdu-fontend/data-models';

const listUI: VisibleEntity[] = [
  {
    key: 'stt',
    title: 'STT',
    width: 60,
    pinned: true,
    visible: true
  },
  {
    key: 'status',
    title: 'Trạng thái chuyến xe',
    textColor: "#32863d",
    pinned: false,
    visible: true
  },
  {
    key: 'name',
    title: 'Tên tuyến đường',
    width: null,
    pinned: false,
    visible: true
  },
  {
    key: 'startedAt',
    title: 'Ngày bắt đầu',
    width: null,
    pinned: false,
    visible: true
  },
  {
    key: 'endedAt',
    title: 'Ngày kết thúc',
    pinned: false,
    visible: true
  },
  {
    key: 'driver',
    title: 'Tên tài xế',
    width: null,
    pinned: false,
    visible: true
  },
  {
    key: 'bsx',
    title: 'Biển số xe',
    width: null,
    pinned: false,
    visible: true
  },
  {
    key: 'garage',
    title: 'Nhà xe',
    width: null,
    pinned: false,
    visible: true
  }
];

export const RouteConstant = { listUI };
