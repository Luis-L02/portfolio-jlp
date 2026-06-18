import { Injectable, signal } from '@angular/core';

export interface Project {
  titleKey: string;
  subtitleKey: string;
  descKey: string;
  image: string;
  demoUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  projects = signal<Project[]>([
    {
      titleKey: 'PROJECTS.ITEMS.DEEPCROOP.TITLE',
      subtitleKey: 'PROJECTS.ITEMS.DEEPCROOP.SUBTITLE',
      descKey: 'PROJECTS.ITEMS.DEEPCROOP.DESC',
      image: './assets/images/weather.png',
      demoUrl: 'https://example.com/deepcroop'
    },
    {
      titleKey: 'PROJECTS.ITEMS.ECOMMERCE.TITLE',
      subtitleKey: 'PROJECTS.ITEMS.ECOMMERCE.SUBTITLE',
      descKey: 'PROJECTS.ITEMS.ECOMMERCE.DESC',
      image: './assets/images/ecommerce.png',
      demoUrl: 'https://example.com/ecommerce'
    },
    {
      titleKey: 'PROJECTS.ITEMS.TASK.TITLE',
      subtitleKey: 'PROJECTS.ITEMS.TASK.SUBTITLE',
      descKey: 'PROJECTS.ITEMS.TASK.DESC',
      image: './assets/images/task-manager.png',
      demoUrl: 'https://example.com/task-manager'
    },
    {
      titleKey: 'PROJECTS.ITEMS.ANALYTICS.TITLE',
      subtitleKey: 'PROJECTS.ITEMS.ANALYTICS.SUBTITLE',
      descKey: 'PROJECTS.ITEMS.ANALYTICS.DESC',
      image: './assets/images/dashboard.png',
      demoUrl: 'https://example.com/analytics'
    }
  ]);
}
