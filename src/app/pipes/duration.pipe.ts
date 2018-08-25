import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {

  transform(msec: number): string {
    const m = 60;
    const h = 60 * m;
    const d = 24 * h;

    let tot_sec = Math.floor(msec / 1000);

    let days = Math.floor(tot_sec / d);
    let hours = Math.floor(tot_sec % d / h);
    let minutes = Math.floor(tot_sec % h / m);
    let seconds = tot_sec % m;

    let hoursStr = (hours < 10 ? '0' : '') + hours + ':'
    hoursStr = hours > 0 ? hoursStr : ''

    let durationStr =
      (days > 0 ? days + 'd + ' : '')
      + hoursStr
      + (minutes < 10 ? '0' : '') + minutes + ':'
      + (seconds < 10 ? '0' : '') + seconds;

    console.log('DurationPipe: ' + durationStr);
    return durationStr;
  }
}

@Pipe({ name: 'ETA' })
export class ETAPipe implements PipeTransform {

  transform(msec: number): Date {

    let now = Date.now();
    let eta = new Date(now + Math.floor(msec));

    console.log('ETAPipe: ' + eta);
    return eta;
  }
}