import {BaseLoadOneDto} from "@minhdu-fontend/base-dto";
import {SalaryTypeEnum} from "@minhdu-fontend/enums";

export interface LoadOnePayrollDto extends BaseLoadOneDto {
  // khi update thành công một salary bất kỳ hiện tại bắt buộc phải gọi lại get one( logic tính toán),
  // hiện tại đang truyền vào salary type và salaryId vừa mới dc update thành công, để chỉ update date lại salary đó trong store
  // để không làm thay đổi thứ tự các salary (thứ tự sau khi  sort)
  updateOneSalary?: {
    salaryType: SalaryTypeEnum
    salaryId: number
  }
}
