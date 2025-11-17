import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export type EmptyStateIcon = 'folder' | 'document' | 'calendar' | 'book' | 'search' | 'inbox' | 'academic';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyStateComponent {
  @Input() icon: EmptyStateIcon = 'inbox';
  @Input() title: string = 'No items found';
  @Input() message: string = 'There are no items to display at this time.';
  @Input() showAction: boolean = false;
  @Input() actionLabel: string = 'Go Back';
  @Input() actionRoute: string[] = ['/branches'];
  @Input() actionLink: string | null = null; // For external links
}

