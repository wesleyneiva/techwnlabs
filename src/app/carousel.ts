import { Component, DestroyRef, ElementRef, afterNextRender, inject, input, signal, viewChild } from '@angular/core';

export interface Slide {
  src: string;
  alt: string;
  caption: string;
}

const AUTOPLAY_MS = 5000;

// Carrossel das telas em Projetos. O arrastar é o scroll nativo (scroll-snap); o índice só acompanha a posição.
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel {
  readonly slides = input.required<Slide[]>();
  readonly label = input.required<string>();
  readonly prevLabel = input.required<string>();
  readonly nextLabel = input.required<string>();
  readonly goLabel = input.required<string>();

  readonly index = signal(0);

  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly destroyRef = inject(DestroyRef);
  private reducedMotion = false;
  private inView = false;
  private held = false; // mouse em cima ou foco dentro
  private stopped = false; // depois que a pessoa mexe, não anda mais sozinho
  private moving = false; // rolagem pedida por botão: o índice já é o destino, não a posição do meio do caminho

  constructor() {
    afterNextRender(() => this.startAutoplay());
  }

  go(i: number): void {
    const el = this.track().nativeElement;
    const n = this.slides().length;
    const target = (i + n) % n;
    this.moving = true;
    this.index.set(target);
    el.scrollTo({ left: target * el.clientWidth, behavior: this.reducedMotion ? 'auto' : 'smooth' });
  }

  goByUser(i: number): void {
    this.stop();
    this.go(i);
  }

  stop(): void {
    this.stopped = true;
  }

  onPointerDown(): void {
    this.stop();
    this.moving = false;
  }

  hold(value: boolean): void {
    this.held = value;
  }

  onScrollEnd(): void {
    this.moving = false;
    this.onScroll();
  }

  onScroll(): void {
    if (this.moving) return;
    const el = this.track().nativeElement;
    this.index.set(Math.round(el.scrollLeft / el.clientWidth));
  }

  private startAutoplay(): void {
    this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reducedMotion) return;

    const observer = new IntersectionObserver(([entry]) => (this.inView = entry.isIntersecting), { threshold: 0.5 });
    observer.observe(this.track().nativeElement);
    const timer = setInterval(() => {
      if (this.inView && !this.held && !this.stopped && !document.hidden) this.go(this.index() + 1);
    }, AUTOPLAY_MS);

    this.destroyRef.onDestroy(() => {
      observer.disconnect();
      clearInterval(timer);
    });
  }
}
