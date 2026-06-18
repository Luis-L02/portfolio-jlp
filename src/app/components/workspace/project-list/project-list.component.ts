import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { DataService } from '../../../core/data.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './project-list.component.html'
})
export class ProjectListComponent {
  dataService = inject(DataService);
}
