import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardSkeletonComponent } from '../card-skeleton/card-skeleton';

@Component({
  selector: 'app-grid-skeleton',
  standalone: true,
  imports: [CommonModule, CardSkeletonComponent],
  templateUrl: './grid-skeleton.html',
  styleUrl: './grid-skeleton.css',
})
export class GridSkeletonComponent {
  @Input() count: number = 6;
  @Input() columns: string = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  @Input() lines: number = 2;
  @Input() showBadge: boolean = false;
  @Input() showButton: boolean = false;

  getCountArray(): number[] {
    return Array(this.count).fill(0).map((_, i) => i);
  }
}

