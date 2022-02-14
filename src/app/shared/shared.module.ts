import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardComponent } from './components/card/card.component';
import { HasPipe } from './pipes/has.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [CardComponent, HasPipe],
  exports: [CardComponent, HasPipe],
})
export class SharedModule {}
