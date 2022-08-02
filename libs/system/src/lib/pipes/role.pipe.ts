import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '@minhdu-fontend/enums';

@Pipe({
  name: 'role',
  pure: false
})
export class RolePipe implements PipeTransform {
  transform(role: Role, roles: any[]): string {
    return roles.find((item: any) => item.role === role).name;
  }
}
