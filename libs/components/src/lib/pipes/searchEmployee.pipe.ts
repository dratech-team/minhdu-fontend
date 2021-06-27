import { Pipe, PipeTransform } from '@angular/core';
import { Employee } from '../../../../../apps/hr/src/app/pages/employee/+state/employee.interface';

@Pipe({
  name: 'searchEmployee',
})
export class SearchEmployeePipe implements PipeTransform {
  transform(items: Employee[], searchValue: any): Employee[] {
    if (!searchValue) { return items; }
    return items.filter((e) => e.firstName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
      e.lastName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
      e.id.toString().indexOf(searchValue) !== -1);
  }
}
