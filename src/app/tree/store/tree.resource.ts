import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from './tree.state';

function* catGenerator(): Generator<Category, Category, unknown> {
  let index = 0;

  while (true) {
    yield {
      id: `${index}`,
      label: `Cat ${index}`,
      children: [],
      type: 'category',
    };
    index++;
  }
}

const generator = catGenerator(); // "Generator { }"

const categories: Array<Category> = Array.from({ length: 5 }).map(() => generator.next().value);

@Injectable({ providedIn: 'root' })
export class TreeResource {
  getCategories(): Observable<Array<Category>> {
    categories[4].children = [{ id: '-1', label: 'lala', children: [], type: 'category' }];
    return of(categories);
  }

  getSubCategories(categoryId: string): Observable<{ categoryId: string; children: Array<Category> }> {
    return of({
      children: Array.from({ length: 5 }).map(() => generator.next().value),
      categoryId,
    });
  }
}
