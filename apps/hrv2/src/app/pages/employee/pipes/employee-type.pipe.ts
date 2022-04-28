import {Pipe, PipeTransform} from "@angular/core";
import {EmployeeType} from "@minhdu-fontend/enums";
import {EmployeeTypeConstant} from "../containers/constants/employee-type.constant";

@Pipe({
  name:'employeetype'
})
export class EmployeeTypePipe implements PipeTransform{
  transform(employeeType: EmployeeType): any {
    return EmployeeTypeConstant.find(item => item.value === employeeType)?.name
  }
}
