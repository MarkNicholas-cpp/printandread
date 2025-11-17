import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../skeleton';

@Component({
  selector: 'app-card-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  templateUrl: './card-skeleton.html',
  styleUrl: './card-skeleton.css',
})
export class CardSkeletonComponent {
  @Input() lines: number = 2;
  @Input() showBadge: boolean = false;
  @Input() showButton: boolean = false;

  getLinesArray(): number[] {
    return Array(this.lines).fill(0).map((_, i) => i);
  }
}

