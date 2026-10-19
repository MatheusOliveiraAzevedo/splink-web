import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button type="button" class="theme-toggle" (click)="toggle()"
      [attr.aria-label]="dark() ? 'Ativar modo claro' : 'Ativar modo escuro'"
      [attr.title]="dark() ? 'Ativar modo claro' : 'Ativar modo escuro'">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        @if (dark()) {
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
        } @else {
          <path d="M20.5 14a9 9 0 0 1-10.5-10.5A9 9 0 1 0 20.5 14Z" />
        }
      </svg>
    </button>
  `,
  styles: `
    .theme-toggle { position: fixed; left: 1rem; bottom: max(1rem, env(safe-area-inset-bottom)); z-index: 1001;
      display: grid; place-items: center; width: 48px; height: 48px; border: 1px solid var(--theme-border);
      border-radius: 50%; background: var(--theme-surface); color: var(--theme-accent); box-shadow: 0 3px 14px #0003; }
    .theme-toggle:hover { border-color: currentColor; }
    .theme-toggle:focus-visible { outline: 3px solid var(--theme-accent); outline-offset: 3px; }
    @media print { .theme-toggle { display: none; } }
  `,
})
export class ThemeToggleComponent {
  readonly dark = signal(document.documentElement.dataset['bsTheme'] === 'dark');

  toggle(): void {
    this.dark.update(value => !value);
    const theme = this.dark() ? 'dark' : 'light';
    document.documentElement.dataset['bsTheme'] = theme;
    try { localStorage.setItem('splink-theme', theme); }
    catch { /* The current page still works when browser storage is unavailable. */ }
  }
}
