import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="py-8 text-center text-text-muted border-t border-border-muted bg-bg-secondary/30 mt-12 transition-all duration-300">
      <p class="text-xs">&copy; 2026 JLLP.DEV. All rights reserved.</p>
    </footer>
  `
})
export class FooterComponent {}
