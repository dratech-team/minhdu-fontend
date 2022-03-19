import { ActivityType } from '../enums';


export const MethodConstant = [
  {
    name: 'Thêm',
    method: ActivityType.POST
  },
  {
    name: 'Xóa',
    method: ActivityType.DELETE
  },
  {
    name: 'Sửa',
    method: ActivityType.PATCH
  },
  {
    name: 'Xem dữ liệu',
    method: ActivityType.GET
  },
  {
    name: 'tất cả',
    method: ''
  }

];
