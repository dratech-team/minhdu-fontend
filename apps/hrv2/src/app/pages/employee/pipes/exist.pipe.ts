import {Pipe, PipeTransform} from "@angular/core";
import {EmployeeType} from "@minhdu-fontend/enums";
import {EmployeeTypeConstant} from "../constants/employee-type.constant";

@Pipe({
  name:'existpipe'
})
export class ExistPipe implements PipeTransform{
  transform(item?: any): any {
    return item ? item: 'Chưa cập nhật'
  }
}
