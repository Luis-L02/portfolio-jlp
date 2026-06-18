import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './core/theme.service';
import { HeaderComponent } from './components/header/header.component';
import { DynamicBackgroundComponent } from './components/dynamic-background/dynamic-background.component';
import { HeroComponent } from './components/hero/hero.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    DynamicBackgroundComponent,
    HeroComponent,
    WorkspaceComponent,
    FooterComponent
  ],
  templateUrl: './app.html'
})
export class App {
  private translate = inject(TranslateService);
  themeService = inject(ThemeService);

  constructor() {
    this.translate.addLangs(['es', 'en']);
    this.translate.setFallbackLang('es');
    this.translate.use('es');
  }
}
