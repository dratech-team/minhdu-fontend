import { Pipe, PipeTransform } from '@angular/core';
import { SortEntity } from '@minhdu-fontend/data-models';

@Pipe({
  name: 'nzsort'
})
export class CustomNgSortPipe implements PipeTransform {
  constructor() {
  }

  transform(sort: SortEntity | undefined | null): any {
    if (sort) {
      const directions = sort.directions ? (sort.directions === 'ascend' ? 'asc' : 'desc') : null;
      if (directions) {
        return { ...sort, directions: directions };
      }
      return {};
    }
    return {};
  }
}
