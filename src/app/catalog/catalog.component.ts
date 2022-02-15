import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CdkDragMove } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent implements AfterViewInit {
  @ViewChild('resizeBox') resizeBox!: ElementRef<HTMLDivElement>;
  @ViewChild('dragHandleRight') dragHandleRight!: ElementRef;

  private preDragWidth: number = 0;

  ngAfterViewInit(): void {
    this.setHandleTransform();
  }

  setHandleTransform() {
    this.dragHandleRight.nativeElement.style.transform = `translate(0px, 0)`;
  }

  dragStart() {
    this.preDragWidth = this.resizeBox.nativeElement.getBoundingClientRect().width;
  }

  dragMove(dragHandle: HTMLElement, $event: CdkDragMove<unknown>) {
    const width = (this.preDragWidth ?? 0) + $event.distance.x;
    this.resizeBox.nativeElement.style.width = width + 'px';
    this.setHandleTransform();
  }
}
