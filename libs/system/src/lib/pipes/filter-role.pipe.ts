import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '../../../../enums/hr/role.enum';

@Pipe({
  name: 'filterRole',
  pure: false
})
export class FilterRolePipe implements PipeTransform {
  transform(role: Role, roles: any []): any {
    let result = '';
    roles.forEach((item: any) => {
      if (role === item.role) {
        result = item.name;
      }
    });
    return result;
  }
}
