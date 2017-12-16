import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'size'
})
export class SizePipe implements PipeTransform {

  transform(bytes: number): string {
    const kB = 1024;
    const p = 0;
    if (bytes > Math.pow(kB, 4)) { return (bytes / Math.pow(kB, 4)).toFixed(p) + ' TB'; }
    if (bytes > Math.pow(kB, 3)) { return (bytes / Math.pow(kB, 3)).toFixed(p) + ' GB'; }
    if (bytes > Math.pow(kB, 2)) { return (bytes / Math.pow(kB, 2)).toFixed(p) + ' MB'; }
    if (bytes > kB) { return (bytes / kB).toFixed(p) + ' kB'; }
    return bytes + ' B';
  }

}
