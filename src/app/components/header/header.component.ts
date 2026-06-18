import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private translate = inject(TranslateService);
  themeService = inject(ThemeService);
  
  currentLang = signal<string>('es');

  setLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang.set(lang);
  }
}
