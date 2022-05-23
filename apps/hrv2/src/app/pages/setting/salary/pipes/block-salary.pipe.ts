import {Pipe, PipeTransform} from '@angular/core';
import {SalaryTypeEnum} from '@minhdu-fontend/enums';

@Pipe({
  name: 'blocksalary',
})
export class BlockSalaryPipe implements PipeTransform {
  transform(name: SalaryTypeEnum, blockSalary: any[]): any {
    if( name ===  SalaryTypeEnum.BASIC_INSURANCE){
      return 'Lương trích bảo hiểm'
    }else{
      return blockSalary.find((item: any) => item.type === name)?.title || ''
    }
  }
}
