import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../skeleton';

@Component({
  selector: 'app-viewer-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  templateUrl: './viewer-skeleton.html',
  styleUrl: './viewer-skeleton.css',
})
export class ViewerSkeletonComponent {}

