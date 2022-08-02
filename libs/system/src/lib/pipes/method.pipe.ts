import { Pipe, PipeTransform } from '@angular/core';
import { MethodConstant } from '@minhdu-fontend/constants';

@Pipe({
  name: 'method',
  pure: false
})
export class MethodPipe implements PipeTransform {
  transform(method: string): string {
    return MethodConstant.find((item) => item.value === method)?.name || '-';
  }
}
