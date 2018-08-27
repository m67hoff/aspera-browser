import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'status' })
export class StatusPipe implements PipeTransform {

  transform(status: string): string {
    switch (status) {
      case 'cancelled':
        return 'pause'
      default:
        return status;
    }
  }
}