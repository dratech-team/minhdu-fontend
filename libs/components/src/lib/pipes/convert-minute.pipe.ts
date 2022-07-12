import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minute',
  pure: false,
})
export class ConvertMinutePipe implements PipeTransform {
  transform(minute: number) {
    return {
      hour: Math.floor(minute / 60),
      minute: minute % 60,
    };
  }
}
