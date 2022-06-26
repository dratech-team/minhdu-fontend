import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortpipe'
})
export class SortPipe implements PipeTransform {
  transform(name: string, ...args: any[]): any {
    if (name !== 'ascend' && name !== 'descend') {
      throw new Error('param pass failure. expected is: ascend or descend');
    }
    return name === 'ascend' ? 'asc' : 'desc';
  }
}
