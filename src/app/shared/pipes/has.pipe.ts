import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'has',
})
export class HasPipe implements PipeTransform {
  transform<T>(arr: Array<T> | Set<T>, arg: T): boolean {
    if (Array.isArray(arr)) {
      return arr.find((item) => item === arg) !== undefined;
    }
    if (arr instanceof Set) {
      return arr.has(arg);
    }

    return false;
  }
}
