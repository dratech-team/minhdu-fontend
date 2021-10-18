import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '../../../../enums/hr/role.enum';
import { App } from '@minhdu-fontend/enums';

@Pipe({
  name: 'transformApp',
  pure: false
})
export class TransformAppPipe implements PipeTransform {
  transform(appName: string, apps: any[]): string {
    return apps.find((item: any) => item.app === appName).name;
  }
}
