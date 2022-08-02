import { Pipe, PipeTransform } from '@angular/core';
import { appConstant } from '@minhdu-fontend/constants';

@Pipe({
  name: 'appname',
  pure: false
})
export class AppNamePipePipe implements PipeTransform {
  transform(appName: string | undefined): string {
    return appConstant.find((item) => item.value === appName)?.name || '-';
  }
}
