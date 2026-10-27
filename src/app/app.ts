import { Component, signal, computed, ChangeDetectionStrategy, ElementRef, afterNextRender, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18N, Lang } from './i18n';

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

interface Turnstile {
  render(el: HTMLElement, opts: { sitekey: string; theme: string; language: string }): string;
  getResponse(id: string): string | undefined;
  reset(id: string): void;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss',
})
export class App {
  readonly year = new Date().getFullYear();
  readonly whatsappUrl = 'https://wa.me/5551998369893?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20WN%20Labs';

  // Site key do Turnstile (pública); o widget cobre tech.wnlabs.com.br e localhost.
  readonly turnstileSiteKey = '0x4AAAAAAEeDbfClVmfl0zAK';

  menuOpen = signal(false);
  status = signal<FormStatus>('idle');

  private readonly turnstileEl = viewChild.required<ElementRef<HTMLElement>>('turnstile');
  private turnstileId = '';

  constructor() {
    // O script do Turnstile vem com render=explicit: quem desenha o widget é o componente, depois que o
    // formulário existe. No modo automático o script podia carregar antes do Angular e o widget não aparecia.
    afterNextRender(() => this.renderTurnstile());
  }

  lang = signal<Lang>(readSavedLang());
  // Todos os textos da página saem daqui; trocar o signal retraduz tudo na hora.
  readonly t = computed(() => I18N[this.lang()]);

  toggleLang(): void {
    const next: Lang = this.lang() === 'pt' ? 'en' : 'pt';
    this.lang.set(next);
    document.documentElement.lang = next === 'pt' ? 'pt-BR' : 'en';
    try {
      localStorage.setItem('lang', next);
    } catch {}
  }

  form = { name: '', email: '', phone: '', message: '', company: '', consent: false };

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  closeModal(): void {
    this.status.set('idle');
  }

  async submit(): Promise<void> {
    if (this.status() === 'sending') return;
    this.status.set('sending');
    try {
      const turnstile = getTurnstile();
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...this.form, turnstileToken: turnstile?.getResponse(this.turnstileId) ?? '' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.status.set('sent');
      this.form = { name: '', email: '', phone: '', message: '', company: '', consent: false };
      turnstile?.reset(this.turnstileId);
    } catch {
      this.status.set('error');
    }
  }

  // Espera o script (async) ficar pronto, por até ~15 s.
  private renderTurnstile(tries = 0): void {
    const turnstile = getTurnstile();
    if (turnstile) {
      this.turnstileId = turnstile.render(this.turnstileEl().nativeElement, {
        sitekey: this.turnstileSiteKey,
        theme: 'light',
        language: this.lang() === 'pt' ? 'pt-br' : 'en',
      });
    } else if (tries < 75) {
      setTimeout(() => this.renderTurnstile(tries + 1), 200);
    }
  }
}

function getTurnstile(): Turnstile | undefined {
  return (window as { turnstile?: Turnstile }).turnstile;
}

function readSavedLang(): Lang {
  try {
    return localStorage.getItem('lang') === 'en' ? 'en' : 'pt';
  } catch {
    return 'pt';
  }
}
