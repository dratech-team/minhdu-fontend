import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '../../../../enums/hr/role.enum';

@Pipe({
  name: 'transformRole',
  pure: false
})
export class TransformRolePipe implements PipeTransform {
  transform(role: Role, roles: any []): any {
    return roles.find((item: any) => {
      return item.role === role;
    }).name;
  }
}
