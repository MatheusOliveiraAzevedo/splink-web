import { Directive, ElementRef, OnDestroy, inject } from '@angular/core';

/** Keep PrimeNG's horizontal swipe, but let the browser handle vertical scrolling. */
@Directive({ selector: '[appCarouselTouchDirection]', standalone: true })
export class CarouselTouchDirectionDirective implements OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement;
  private start?: { x: number; y: number };
  private direction: 'horizontal' | 'vertical' | undefined;
  private multiple = false;

  private readonly onStart = (event: TouchEvent) => {
    if (!(event.target instanceof Element) || !event.target.closest('.p-carousel-viewport')) return;
    if (event.touches.length !== 1) { this.multiple = true; return; }
    const touch = event.touches[0];
    this.start = { x: touch.clientX, y: touch.clientY };
    this.direction = undefined;
    this.multiple = false;
  };

  private readonly onMove = (event: TouchEvent) => {
    if (!this.start) return;
    if (event.touches.length !== 1) this.multiple = true;
    if (!this.multiple && !this.direction) {
      const dx = Math.abs(event.touches[0].clientX - this.start.x);
      const dy = Math.abs(event.touches[0].clientY - this.start.y);
      if (Math.max(dx, dy) >= 10) this.direction = dx > dy ? 'horizontal' : 'vertical';
    }
    // Capture runs before PrimeNG's touchmove, which otherwise prevents every scroll.
    // Do not preventDefault: vertical scroll and pinch zoom belong to the browser.
    if (this.multiple || this.direction !== 'horizontal') event.stopPropagation();
  };

  private readonly onEnd = (event: TouchEvent) => {
    if (!this.start) return;
    if (this.multiple || this.direction !== 'horizontal') event.stopPropagation();
    if (event.touches.length === 0) this.reset();
  };

  private readonly onCancel = () => this.reset();

  constructor() {
    this.host.addEventListener('touchstart', this.onStart, { capture: true, passive: true });
    this.host.addEventListener('touchmove', this.onMove, { capture: true, passive: true });
    this.host.addEventListener('touchend', this.onEnd, { capture: true, passive: true });
    this.host.addEventListener('touchcancel', this.onCancel, { capture: true, passive: true });
  }

  private reset(): void { this.start = undefined; this.direction = undefined; this.multiple = false; }

  ngOnDestroy(): void {
    this.host.removeEventListener('touchstart', this.onStart, true);
    this.host.removeEventListener('touchmove', this.onMove, true);
    this.host.removeEventListener('touchend', this.onEnd, true);
    this.host.removeEventListener('touchcancel', this.onCancel, true);
  }
}
