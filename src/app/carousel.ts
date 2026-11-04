import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

export interface Slide {
  src: string;
  alt: string;
  caption: string;
}

export interface CarouselLabels {
  label: string;
  prev: string;
  next: string;
  go: string;
  open: string;
  close: string;
  zoom: string;
}

const AUTOPLAY_MS = 5000;

// Carrossel das telas em Projetos. O arrastar é o scroll nativo (scroll-snap); o índice só acompanha a posição.
// Clicar numa tela abre a versão grande (`-full.webp`) num <dialog>, com zoom.
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel {
  readonly slides = input.required<Slide[]>();
  readonly labels = input.required<CarouselLabels>();

  readonly index = signal(0);
  readonly zoomed = signal(false);
  readonly viewing = signal(false); // a imagem grande só existe (e só baixa) com a janela aberta

  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private reducedMotion = false;
  private inView = false;
  private held = false; // mouse em cima ou foco dentro
  private stopped = false; // depois que a pessoa mexe, não anda mais sozinho
  private moving = false; // rolagem pedida por botão: o índice já é o destino, não a posição do meio do caminho

  constructor() {
    afterNextRender(() => this.startAutoplay());
  }

  fullSrc(slide: Slide): string {
    return slide.src.replace('.webp', '-full.webp');
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
    this.zoomed.set(false);
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

  open(i: number): void {
    this.stop();
    if (i !== this.index()) this.go(i);
    this.zoomed.set(false);
    this.viewing.set(true);
    this.dialog().nativeElement.showModal();
  }

  onClosed(): void {
    this.viewing.set(false);
    this.zoomed.set(false);
  }

  close(): void {
    this.dialog().nativeElement.close();
  }

  // Clique fora da imagem fecha; o clique nela é tratado em toggleZoom.
  onStageClick(event: MouseEvent): void {
    if (!(event.target instanceof HTMLImageElement)) this.close();
  }

  onDialogKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') this.goByUser(this.index() - 1);
    if (event.key === 'ArrowRight') this.goByUser(this.index() + 1);
  }

  // Com o clique, o ponto clicado fica no centro da tela; pelo botão ou teclado, o centro da imagem.
  toggleZoom(event?: MouseEvent): void {
    const img = event?.target instanceof HTMLImageElement ? event.target.getBoundingClientRect() : null;
    const x = img && event ? (event.clientX - img.left) / img.width : 0.5;
    const y = img && event ? (event.clientY - img.top) / img.height : 0.5;
    this.zoomed.update((v) => !v);
    if (!this.zoomed()) return;
    afterNextRender(
      () => {
        const stage = this.stage().nativeElement;
        stage.scrollTo({
          left: x * stage.scrollWidth - stage.clientWidth / 2,
          top: y * stage.scrollHeight - stage.clientHeight / 2,
        });
      },
      { injector: this.injector },
    );
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
