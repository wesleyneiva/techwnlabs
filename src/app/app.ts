import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly year = new Date().getFullYear();
  readonly whatsappUrl = 'https://wa.me/5521995742789?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20WN%20Labs';

  menuOpen = signal(false);
  status = signal<FormStatus>('idle');

  form = { name: '', email: '', message: '' };

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  async submit(): Promise<void> {
    if (this.status() === 'sending') return;
    this.status.set('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.status.set('sent');
      this.form = { name: '', email: '', message: '' };
    } catch {
      this.status.set('error');
    }
  }
}
