import {PartialDayEnum} from "@minhdu-fontend/data-models";
import {partialDay} from "@minhdu-fontend/enums";

export const TitleSessionConstant = [
  {title: 'buổi sáng', type: PartialDayEnum.MORNING, times: partialDay.PARTIAL},
  {title: 'buổi chiều', type: PartialDayEnum.AFTERNOON, times: partialDay.PARTIAL},
  {title: 'buổi tối', type: PartialDayEnum.NIGHT, times: partialDay.PARTIAL},
  {title: 'nguyên ngày', type: PartialDayEnum.ALL_DAY, times: partialDay.ALL_DAY}
];
