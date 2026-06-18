import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ProjectListComponent } from './project-list/project-list.component';
import { ExperienceTimelineComponent } from './experience-timeline/experience-timeline.component';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ProjectListComponent, ExperienceTimelineComponent],
  templateUrl: './workspace.component.html'
})
export class WorkspaceComponent {
  activeTab = signal<number>(0); // 0 = Experiencia/Proyectos? Wait, original app.ts says: 0 = Proyectos, 1 = Experiencia.
}
