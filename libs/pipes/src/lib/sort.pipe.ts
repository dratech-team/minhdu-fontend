import { Pipe, PipeTransform } from '@angular/core';

/// FIXME: Không gọi được trong effect của akita ng NullInjectorError: NullInjectorError: No provider for SortPipe!
@Pipe({
  name: 'sortpipe',
  standalone: true,
})
export class SortPipe implements PipeTransform {
  transform(name: string, ...args: any[]): any {
    if (name !== 'ascend' && name !== 'descend') {
      throw new Error('param pass failure. expected is: ascend or descend');
    }
    return name === 'ascend' ? 'asc' : 'desc';
  }
}
