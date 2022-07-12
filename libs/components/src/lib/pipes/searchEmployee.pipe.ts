import { Pipe, PipeTransform } from '@angular/core';
import { Employee } from '@minhdu-fontend/data-models';

@Pipe({
  name: 'searchEmployee',
})
export class SearchEmployeePipe implements PipeTransform {
  transform(items: Employee[], searchValue: any): Employee[] {
    if (!searchValue) {
      return items;
    }
    return items.filter(
      (e) =>
        e.lastName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
        e.id.toString().indexOf(searchValue) !== -1
    );
  }
}
