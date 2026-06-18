import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dynamic-background',
  standalone: true,
  templateUrl: './dynamic-background.component.html',
  styleUrls: ['./dynamic-background.component.css'],
  host: {
    class: 'block absolute inset-0 z-0 pointer-events-none overflow-hidden'
  }
})
export class DynamicBackgroundComponent {
  @Input() theme: 'dark' | 'light' = 'dark';
}
