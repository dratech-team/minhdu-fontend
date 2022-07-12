import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '../../../../enums/hr/role.enum';

@Pipe({
  name: 'transformRole',
  pure: false,
})
export class TransformRolePipe implements PipeTransform {
  transform(role: Role, roles: any[]): string {
    return roles.find((item: any) => item.role === role).name;
  }
}
