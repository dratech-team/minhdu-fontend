import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '../../../../enums/hr/role.enum';
import { App } from '@minhdu-fontend/enums';

@Pipe({
  name: 'transformMethod',
  pure: false
})
export class TransformMethodPipe implements PipeTransform {
  transform(method: string, methods: any[]): string {
    return methods.find((item: any) => item.method === method).name;
  }
}
