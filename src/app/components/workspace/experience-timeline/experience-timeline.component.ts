import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-experience-timeline',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './experience-timeline.component.html'
})
export class ExperienceTimelineComponent {}
