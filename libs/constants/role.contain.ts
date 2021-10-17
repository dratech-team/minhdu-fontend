import { Role } from '../enums/hr/role.enum';

export const roleAppHR = [
  {
    name: 'Quản trị viên',
    role: Role.ADMIN
  },
  {
    name: 'Kế toán trưởng',
    role: Role.CHIEF_ACCOUNTANT
  },
  {
    name: ' Kế toán quỹ',
    role: Role.ACCOUNTANT_CASH_FUND
  },
  {
    name: 'Kế toán MODERATION',
    role: Role.ACCOUNTANT_MODERATION
  },
  {
    name: 'Quản lý nhân sự',
    role: Role.HUMAN_RESOURCE
  },
  {
    name: 'Kế toán',
    role: Role.CAMP_ACCOUNTING
  },
  {
    name: 'Quản lý trại',
    role: Role.CAMP_MANAGEMENT
  },
  {
    name: 'Giám đốc trại',
    role: Role.CAMP_DIRECTOR,
  },
  {
    name: 'Kế toán trại ấp',
    role: Role.HATCHERY_ACCOUNTING,
  },
  {
    name: 'Quản lý trại ấp',
    role: Role.HATCHERY_MANAGEMENT,
  },
  {
    name: 'Không có chức vụ',
    role: Role.NONE,
  },
]
export const roleAppSell = [
  {
    name: 'Quản trị viên',
    role: Role.ADMIN
  },
  {
    name: 'Bán hàng',
    role: Role.SALESMAN
  },
  {
    name: 'Bán trứng',
    role: Role.SALESMAN_EGG
  },
  {
    name: 'Xuất nhập khẩu',
    role: Role.IMPORTER_EXPORTER
  },
  {
    name: 'Không có chức vụ',
    role: Role.NONE,
  },
]
