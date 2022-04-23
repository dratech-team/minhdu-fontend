import {PartialDayEnum} from '@minhdu-fontend/data-models';

export const SessionConstant = [
    {
        name: 'Buổi sáng',
        detail: 'Ngày buổi sáng',
        value: PartialDayEnum.MORNING,
        startTime: new Date(new Date().setHours(7, 0, 0)),
        endTime: new Date(new Date().setHours(11, 30, 0))
    },
    {
        name: 'Buổi chiều',
        detail: 'Ngày buổi chiều',
        value: PartialDayEnum.AFTERNOON,
        startTime: new Date(new Date().setHours(13, 30, 0)),
        endTime: new Date(new Date().setHours(17, 0, 0))
    },
    {
        name: 'Nguyên ngày',
        detail: 'Ngày',
        value: PartialDayEnum.ALL_DAY,
        startTime: new Date(new Date().setHours(7, 0, 0)),
        endTime: new Date(new Date().setHours(17, 0, 0))
    },
    {
        name: 'Tuỳ chọn',
        detail: 'Phút',
        value: PartialDayEnum.CUSTOM,
        startTime: new Date(new Date().setHours(7, 0, 0)),
        endTime: new Date(new Date().setHours(17, 0, 0))
    }
];


