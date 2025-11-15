import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface BreadcrumbSegment {
  label: string;
  route?: string[];
  icon?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css',
})
export class BreadcrumbComponent {
  @Input() segments: BreadcrumbSegment[] = [];
  @Input() showHome: boolean = true;

  getSegments(): BreadcrumbSegment[] {
    if (this.showHome) {
      return [
        { label: 'Home', route: ['/home'], icon: 'home' },
        ...this.segments
      ];
    }
    return this.segments;
  }
}

