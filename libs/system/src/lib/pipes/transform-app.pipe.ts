import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'transformApp',
  pure: false
})
export class TransformAppPipe implements PipeTransform {
  transform(appName: string, apps: any[]): string {
    if (appName) {
      return apps.find((item: any) => item.app === appName).name;
    } else {
      return '-';
    }

  }
}
