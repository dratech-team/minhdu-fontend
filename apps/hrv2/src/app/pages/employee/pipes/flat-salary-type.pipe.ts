import {Pipe, PipeTransform} from "@angular/core";
import {EmployeeType} from "@minhdu-fontend/enums";
import {EmployeeTypeConstant} from "../constants/employee-type.constant";

@Pipe({
  name:'flatsalarytypepipe'
})
export class FlatSalaryTypePipe implements PipeTransform{
  transform(flatSalaryType: boolean): any {
    return flatSalaryType ? 'Lương cố định': 'Lương không cố định'
  }
}
