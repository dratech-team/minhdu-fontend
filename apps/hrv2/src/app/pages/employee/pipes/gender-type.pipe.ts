import {Pipe, PipeTransform} from "@angular/core";
import {Gender} from "@minhdu-fontend/enums";
import {GenderTypeConstant} from "@minhdu-fontend/constants";

@Pipe({
  name:'gendertype'
})
export class GenderTypePipe implements PipeTransform{
  transform(genderType: Gender): any {
    return GenderTypeConstant.find(item => item.value === genderType)?.name
  }
}
