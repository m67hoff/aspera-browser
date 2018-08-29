import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {

  transform(msec: number): string {
    const m = 60;
    const h = 60 * m;
    const d = 24 * h;

    const tot_sec = Math.floor(msec / 1000);

    const days = Math.floor(tot_sec / d);
    const hours = Math.floor(tot_sec % d / h);
    const minutes = Math.floor(tot_sec % h / m);
    const seconds = tot_sec % m;

    let hoursStr = (hours < 10 ? '0' : '') + hours + ':';
    hoursStr = hours > 0 ? hoursStr : '';

    const durationStr =
      (days > 0 ? days + 'd + ' : '')
      + hoursStr
      + (minutes < 10 ? '0' : '') + minutes + ':'
      + (seconds < 10 ? '0' : '') + seconds;

    // console.log('DurationPipe: ' + durationStr);
    return durationStr;
  }
}

@Pipe({ name: 'ETA' })
export class ETAPipe implements PipeTransform {

  transform(msec: number): Date {

    const now = Date.now();
    const eta = new Date(now + Math.floor(msec));

    // console.log('ETAPipe: ' + eta);
    return eta;
  }
}
