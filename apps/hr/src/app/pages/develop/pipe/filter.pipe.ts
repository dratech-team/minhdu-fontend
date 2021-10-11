import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTypeMaintain',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(features: any[], type: string): any {
    return features?.filter((feature) => feature.type === type);
  }
}
