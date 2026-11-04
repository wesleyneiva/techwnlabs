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
  private held = false; // mouse em cima ou foco de teclado dentro
  private lastTouch = 0; // depois que a pessoa mexe, espera um intervalo inteiro antes de andar de novo
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
    this.touched();
    this.go(i);
  }

  onPointerDown(): void {
    this.touched();
    this.moving = false;
  }

  // Só mouse: no toque o "enter" não tem saída garantida e o carrossel ficaria preso.
  onPointerEnter(event: PointerEvent): void {
    if (event.pointerType === 'mouse') this.held = true;
  }

  // Foco de clique não segura, senão a seta clicada pararia o carrossel até clicar em outro lugar.
  onFocusIn(event: FocusEvent): void {
    this.held = (event.target as HTMLElement).matches(':focus-visible');
  }

  release(): void {
    this.held = false;
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

  private touched(): void {
    this.lastTouch = Date.now();
  }

  private startAutoplay(): void {
    // Com "reduzir movimento" continua passando, só que troca direto, sem deslizar.
    this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(([entry]) => (this.inView = entry.isIntersecting), { threshold: 0.5 });
    observer.observe(this.track().nativeElement);
    const timer = setInterval(() => {
      const waited = Date.now() - this.lastTouch >= AUTOPLAY_MS;
      if (this.inView && !this.held && waited && !document.hidden) this.go(this.index() + 1);
    }, AUTOPLAY_MS);

    this.destroyRef.onDestroy(() => {
      observer.disconnect();
      clearInterval(timer);
    });
  }
}
