import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBarComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  animatedPlaceholder: string = '';
  @Output() searchSubmit = new EventEmitter<string>();

  private placeholderTexts: string[] = [
    'Search by title... e.g., "DBMS Unit 1 Notes"',
    'Search by type... e.g., "Question Paper", "Lab Manual"',
    'Search subjects... e.g., "Database Management"',
    'Search materials... e.g., "Midterm Papers", "Syllabus"'
  ];
  private currentPlaceholderIndex: number = 0;
  private typingInterval: any;
  private erasingInterval: any;
  private isTyping: boolean = false;
  private isErasing: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startTypingAnimation();
  }

  ngOnDestroy(): void {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
    if (this.erasingInterval) {
      clearInterval(this.erasingInterval);
    }
  }

  startTypingAnimation(): void {
    const typeText = () => {
      if (this.isErasing || this.isTyping) return;
      
      const currentText = this.placeholderTexts[this.currentPlaceholderIndex];
      let charIndex = 0;
      this.isTyping = true;
      this.animatedPlaceholder = '';

      this.typingInterval = setInterval(() => {
        if (charIndex < currentText.length) {
          this.animatedPlaceholder += currentText[charIndex];
          charIndex++;
        } else {
          clearInterval(this.typingInterval);
          this.isTyping = false;
          // Wait before erasing
          setTimeout(() => {
            this.startErasingAnimation();
          }, 2000);
        }
      }, 50);
    };

    typeText();
  }

  startErasingAnimation(): void {
    if (this.isErasing || this.isTyping) return;
    
    this.isErasing = true;
    this.erasingInterval = setInterval(() => {
      if (this.animatedPlaceholder.length > 0) {
        this.animatedPlaceholder = this.animatedPlaceholder.slice(0, -1);
      } else {
        clearInterval(this.erasingInterval);
        this.isErasing = false;
        // Move to next placeholder
        this.currentPlaceholderIndex = (this.currentPlaceholderIndex + 1) % this.placeholderTexts.length;
        // Start typing next text
        setTimeout(() => {
          this.startTypingAnimation();
        }, 500);
      }
    }, 30);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.searchSubmit.emit(this.searchQuery.trim());
      // Navigate to search results page
      this.router.navigate(['/search'], { 
        queryParams: { q: this.searchQuery.trim() } 
      });
      this.searchQuery = ''; // Clear input after search
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  onFocus(): void {
    // Pause animation when user focuses
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.isTyping = false;
    }
    if (this.erasingInterval) {
      clearInterval(this.erasingInterval);
      this.isErasing = false;
    }
  }

  onBlur(): void {
    // Resume animation when user blurs (if input is empty)
    if (!this.searchQuery.trim()) {
      this.animatedPlaceholder = '';
      this.startTypingAnimation();
    }
  }
}

