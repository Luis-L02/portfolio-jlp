import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme = signal<'dark' | 'light'>('dark');

  constructor() {
    this.initThemeDetection();
  }

  private initThemeDetection(): void {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    this.applyTheme(mediaQuery.matches ? 'light' : 'dark');

    // Escucha cambios en tiempo real si el usuario cambia el tema del sistema
    mediaQuery.addEventListener('change', (e: MediaQueryListEvent) => {
      this.applyTheme(e.matches ? 'light' : 'dark');
    });
  }

  private applyTheme(newTheme: 'dark' | 'light'): void {
    this.theme.set(newTheme);
    if (typeof document !== 'undefined') {
      if (newTheme === 'light') {
        document.documentElement.classList.add('light-theme');
      } else {
        document.documentElement.classList.remove('light-theme');
      }
    }
  }

  toggleTheme(): void {
    const newTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }
}
