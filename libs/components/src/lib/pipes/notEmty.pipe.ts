import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notEmpty'
})
export class NotEmptyPipe implements PipeTransform {
  transform(value: any, replaceWith: any = ""): any {
    if (!value) {
      return replaceWith;
    }
    return value;
  }
}
