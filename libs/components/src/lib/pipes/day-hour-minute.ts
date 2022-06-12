import {Pipe, PipeTransform} from "@angular/core";
import {DatePipe} from "@angular/common";

@Pipe({
  name: 'dayhourminute'
})
export class DayHourMinutePipe implements PipeTransform {
  transform(duration?: {day: number, hour: number , minute: number}): any {
    return duration ? `${duration.day} ngày ${duration.hour} giờ ${duration.minute} phút` : 'Chưa cập nhật'
  }
}
